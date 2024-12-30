const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug, downloadExcel, parseExcelFile } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');

const prisma = new PrismaClient();

const upsertGovernmentWaterBody = async (req, res) => {
    try {
        const slug = generateSlug(req.body.pond);
        const uniqueErrors = {};
        if (req.body.uniqueId) {
            const isUniqueIdExist = await prisma.government_water_bodies.findFirst({ where: { uniqueId: req.body.uniqueId, isDeleted: "N", ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isUniqueIdExist) { uniqueErrors.uniqueId = 'Unique Id ' + respMsg.isAlreadyExist };
        };
        if (slug) {
            const isSlugExist = await prisma.government_water_bodies.findFirst({ where: { slug: slug, isDeleted: "N", ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) { uniqueErrors.pond = 'Pond ' + respMsg.isAlreadyExist }
            req.body.slug = slug;
        };
        if (Object.keys(uniqueErrors).length > 0) {
            return res.json({ result: false, message: uniqueErrors });
        }
        if (req.body.id) {
            req.body.id = parseInt(req.body.id);
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.government_water_bodies.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'GWB ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.government_water_bodies.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'GWB ' + respMsg.addedSuccess })
        }
    } catch (error) {
        console.error('Error processing KMZ file:', error);
        return res.json({ result: false, message: error.message });
    }
};

const getGovernmentWaterBody = async (req, res) => {
    try {
        const { page, pageSize } = req.body;
        let queryFilter = { AND: [{ isDeleted: "N" }] };
        const select = { id: true, uniqueId: true, pond: true, latitude: true, longitude: true, taluk: true, village: true }
        let records;
        let totalPages;
        if (page && pageSize) {
            const { searchFilter: { uniqueId, pond, taluk, village } } = req.body;
            queryFilter.AND.push(
                ...(uniqueId ? [{ uniqueId: { contains: uniqueId } }] : []),
                ...(pond ? [{ pond: { contains: pond } }] : []),
                ...(taluk ? [{ taluk: { contains: taluk } }] : []),
                ...(village ? [{ village: { contains: village } }] : []),
            );
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.government_water_bodies.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.government_water_bodies.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: select
            });
        } else {
            records = await prisma.government_water_bodies.findMany({
                where: queryFilter,
                select: select
            });
        }
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
};

const getGovernmentWaterBodyById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const GWB = await prisma.government_water_bodies.findFirst({ where: { id }, select: { id: true, uniqueId: true, pond: true, latitude: true, longitude: true, taluk: true, village: true } });
        if (GWB) {
            return res.json({ result: true, message: GWB });
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
};

const deleteGovernmentWaterBody = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedGWB = await prisma.government_water_bodies.findUnique({ where: { id, isDeleted: "N" } });
        if (!deletedGWB) {
            res.status(200).json({ result: false, message: respMsg.noDataFound });
        } else {
            await prisma.government_water_bodies.update({ where: { id: id }, data: { isDeleted: "Y" } });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'GWB ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
};

const importGovernmentWaterBody = async (req, res) => {
    try {
        const file = req.files.file[0];
        if (!file) {
            return NextResponse.json({ result: false, message: 'No file uploaded' });
        }
        const gwbData = await parseExcelFile(file);
        for (const item of gwbData) {
            delete item.id
            const slug = generateSlug(item.pond);
            item.slug = slug
            item.uniqueId = String(item.uniqueId);
            item.latitude = String(item.latitude);
            item.longitude = String(item.longitude);
            const isUniqueIdExist = await prisma.government_water_bodies.findFirst({ where: { uniqueId: item.uniqueId, isDeleted: "N", } });
            const isSlugExist = await prisma.government_water_bodies.findFirst({ where: { slug: slug, isDeleted: "N" } });
            item.updatedBy = String(req.user.id);
            item.updatedAt = new Date();
            if (!isUniqueIdExist && !isSlugExist) {
                item.slug = slug;
                item.createdBy = String(req.user.id);
                delete item.updatedBy;
                delete item.updatedAt;
                await prisma.government_water_bodies.create({ data: item });
            } else if (isUniqueIdExist && !isSlugExist) {
                await prisma.government_water_bodies.updateMany({ where: { uniqueId: item.uniqueId }, data: item });
            } else {
                await prisma.government_water_bodies.updateMany({ where: { slug: slug }, data: item });
            }
        }
        await updateApiDataVersion(req.user.id);
        return res.json({ result: true, message: 'GWB ' + respMsg.addedSuccess });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
};

const downloadGovernmentWaterBody = async (req, res) => {
    const modelName = 'government_water_bodies';
    if (!modelName) {
        return res.status(400).json({ result: false, message: 'Model name is required' });
    };
    try {
        const model = prisma[modelName];
        if (!model) {
            return res.status(400).json({ result: false, message: `${modelName} does not exist` });
        }
        const data = await model.findMany({
            where: { isDeleted: "N" },
            select: {
                id: true,
                uniqueId: true,
                pond: true,
                latitude: true,
                longitude: true,
                taluk: true,
                village: true
            }
        });
        const headers = Object.keys(data[0] || {})
        const worksheetData = [headers];
        data.forEach(item => {
            const row = headers.map(header => item[header]);
            worksheetData.push(row);
        });
        downloadExcel(res, modelName, worksheetData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: error.message });
    }

};

module.exports = { upsertGovernmentWaterBody, getGovernmentWaterBody, getGovernmentWaterBodyById, deleteGovernmentWaterBody, importGovernmentWaterBody, downloadGovernmentWaterBody };
