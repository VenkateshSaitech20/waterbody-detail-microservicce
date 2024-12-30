const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug, downloadExcel, parseExcelFile } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const select = { id: true, uniqueId: true, tankName: true, district: true, block: true, panchayat: true, village: true, tankType: true, ayacut: true, watSprAr: true, capMcm: true, noOfSluices: true, sluicesType: true, bundLength: true, tbl: true, mwl: true, ftl: true, stoDepth: true, catchment: true, noOFWeirs: true, weirLength: true, lowSill: true, disCusecs: true };

const upsertTankWB = async (req, res) => {
    try {
        if (req.body.id) { req.body.id = parseInt(req.body.id) }
        const existErrors = {};
        const slug = generateSlug(req.body.tankName);
        req.body.slug = slug;
        const existUniqueId = await prisma.tank_water_bodies.findFirst({ where: { uniqueId: req.body.uniqueId, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { uniqueId: true } });
        if (existUniqueId) {
            existErrors.uniqueId = `Unique Id ${respMsg.isAlreadyExist}`
        };
        const existTankName = await prisma.tank_water_bodies.findFirst({ where: { slug: req.body.slug, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { slug: true } });
        if (existTankName) {
            existErrors.tankName = `Tank Name ${respMsg.isAlreadyExist}`
        };
        if (Object.keys(existErrors).length > 0) {
            return res.status(200).json({ result: false, message: existErrors })
        }
        if (req.body.id) {
            const findData = await prisma.tank_water_bodies.findUnique({ where: { id: req.body.id, isDeleted: "N" }, select: { id: true } });
            if (!findData) {
                return res.status(200).json({ result: false, message: respMsg.noDataFound })
            }
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.tank_water_bodies.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Tank Water Body ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.tank_water_bodies.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Tank Water Body ' + respMsg.addedSuccess })
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getTankWB = async (req, res) => {
    try {
        const { page, pageSize } = req.body;
        let queryFilter = { AND: [{ isDeleted: "N" }] };
        let records;
        let totalPages;
        if (page && pageSize) {
            const { searchFilter: { village, block, panchayat } } = req.body;
            queryFilter.AND.push(
                ...(village ? [{ village: { contains: village } }] : []),
                ...(block ? [{ block: { contains: block } }] : []),
                ...(panchayat ? [{ panchayat: { contains: panchayat } }] : []),
            );
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.tank_water_bodies.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.tank_water_bodies.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: select
            });
        } else {
            records = await prisma.tank_water_bodies.findMany({
                where: queryFilter,
                select: select
            });
        }
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getTankWBById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tankWB = await prisma.tank_water_bodies.findFirst({ where: { id }, select: select });
        if (tankWB) {
            return res.json({ result: true, message: tankWB });
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const deleteTankWB = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedTankWB = await prisma.tank_water_bodies.findUnique({ where: { id, isDeleted: "N" } });
        if (!deletedTankWB) {
            res.status(200).json({ result: false, message: respMsg.noDataFound });
        } else {
            await prisma.tank_water_bodies.update({ where: { id: id }, data: { isDeleted: "Y" } });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Tank Water Body ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const importTankWB = async (req, res) => {
    try {
        const file = req.files.file[0];
        if (!file) {
            return NextResponse.json({ result: false, message: 'No file uploaded' });
        }
        const tankWBData = await parseExcelFile(file);
        for (const item of tankWBData) {
            delete item.id
            const slug = generateSlug(item.tankName);
            item.slug = slug
            Object.keys(item).forEach(key => {
                if (item[key] !== null && item[key] !== undefined) {
                    item[key] = String(item[key]);
                }
            });
            const isUniqueIdExist = await prisma.tank_water_bodies.findFirst({ where: { uniqueId: item.uniqueId, isDeleted: "N", } });
            const isSlugExist = await prisma.tank_water_bodies.findFirst({ where: { slug: slug, isDeleted: "N" } });
            item.updatedBy = String(req.user.id);
            item.updatedAt = new Date();
            if (!isUniqueIdExist && !isSlugExist) {
                item.slug = slug;
                item.createdBy = String(req.user.id);
                delete item.updatedBy;
                delete item.updatedAt;
                await prisma.tank_water_bodies.create({ data: item });
            } else if (isUniqueIdExist && !isSlugExist) {
                await prisma.tank_water_bodies.updateMany({ where: { uniqueId: item.uniqueId }, data: item });
            } else {
                await prisma.tank_water_bodies.updateMany({ where: { slug: slug }, data: item });
            }
        }
        await updateApiDataVersion(req.user.id);
        return res.json({ result: true, message: 'Tank WB ' + respMsg.addedSuccess });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const downloadTankWB = async (req, res) => {
    const modelName = 'tank_water_bodies';
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
                uniqueId: true,
                tankName: true,
                district: true,
                block: true,
                panchayat: true,
                village: true,
                tankType: true,
                ayacut: true,
                watSprAr: true,
                capMcm: true,
                noOfSluices: true,
                sluicesType: true,
                bundLength: true,
                ftl: true,
                mwl: true,
                tbl: true,
                stoDepth: true,
                catchment: true,
                noOFWeirs: true,
                weirLength: true,
                lowSill: true,
                disCusecs: true,
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
        res.status(500).json({ result: false, message: error.message });
    }

};

module.exports = { upsertTankWB, getTankWB, getTankWBById, deleteTankWB, downloadTankWB, importTankWB }