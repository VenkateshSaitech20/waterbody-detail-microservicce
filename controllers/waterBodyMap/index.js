const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug, processKmzFile, deleteFile, getFilePathFromUrl } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const upsertWaterBodyMap = async (req, res) => {
    try {
        const files = req.files;
        const geoJsonFiles = {};
        if (Object.keys(files).length === 0) {
            return res.json({ result: false, message: { fileError: respMsg.fileReq } });
        }
        const slug = generateSlug(req.body.district);
        if (slug) {
            const isSlugExist = await prisma.water_body_maps.findFirst({ where: { slug: slug, ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) {
                return res.json({ result: false, message: { name: 'District ' + respMsg.isAlreadyExist } });
            }
            req.body.slug = slug;
        }
        const categoryName = Object.keys(files)[0];
        const categoryFiles = files[categoryName];
        if (categoryFiles && categoryFiles.length > 0) {
            const kmzFile = categoryFiles[0];
            const geoJsonFilePath = await processKmzFile(kmzFile);
            geoJsonFiles[categoryName] = {
                filename: categoryName,
                path: geoJsonFilePath
            };
        }
        req.body.geoJsonFiles = geoJsonFiles;

        if (req.body.id) {
            req.body.id = parseInt(req.body.id);
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();

            const existingRecord = await prisma.water_body_maps.findUnique({
                where: { id: req.body.id },
                select: { geoJsonFiles: true },
            });

            if (existingRecord?.geoJsonFiles) {
                const oldFilePath = existingRecord?.geoJsonFiles[categoryName]?.path;
                if (oldFilePath) {
                    try {
                        const path = getFilePathFromUrl(oldFilePath, '')
                        await deleteFile(path);
                        console.log(`Deleted file: ${oldFilePath}`);
                    } catch (err) {
                        console.error(`Error deleting old file at ${oldFilePath}: ${err.message}`);
                    }
                }
            }

            req.body.geoJsonFiles = {
                ...existingRecord?.geoJsonFiles,
                ...req.body.geoJsonFiles,
            };
            await prisma.water_body_maps.update({
                where: { id: req.body.id },
                data: req.body,
            });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Map ' + respMsg.updatedSuccess });
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.water_body_maps.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Map ' + respMsg.addedSuccess });
        }
    } catch (error) {
        console.log('Error processing KMZ files:', error);
        return res.json({ result: false, message: error.message });
    }
};

const getWaterBodyMap = async (req, res) => {
    try {
        const findMapData = await prisma.water_body_maps.findFirst({ where: { slug: req.body.district }, select: { id: true, district: true, slug: true, geoJsonFiles: true } });
        if (!findMapData) {
            return res.status(200).json({ result: false, message: respMsg.noDataFound });
        }
        res.status(200).json({ result: true, message: findMapData });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}
module.exports = { upsertWaterBodyMap, getWaterBodyMap };
