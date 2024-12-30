const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug, downloadExcel, parseExcelFile } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const select = { id: true, uniqueId: true, tankName: true, district: true, block: true, village: true, taluk: true, subBasin: true, basin: true, section: true, subDn: true, division: true, circle: true, region: true, tankType: true, capacity: true, ftl: true, mwl: true, tbl: true, storageDepth: true, ayacut: true, catchmentArea: true, watSpread: true, noOfWeirs: true, weirLength: true, noOfSluices: true, lowestSill: true, bundLength: true, discharge: true, };

const upsertPWDTank = async (req, res) => {
    try {
        if (req.body.id) { req.body.id = parseInt(req.body.id) }
        const slug = generateSlug(req.body.tankName);
        req.body.slug = slug;
        const existErrors = {};
        const existUniqueId = await prisma.pwd_tanks.findFirst({ where: { uniqueId: req.body.uniqueId, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { uniqueId: true } });
        if (existUniqueId) {
            existErrors.uniqueId = `Unique Id ${respMsg.isAlreadyExist}`
        };
        const existTankName = await prisma.pwd_tanks.findFirst({ where: { slug: req.body.slug, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { slug: true } });
        if (existTankName) {
            existErrors.tankName = `Tank Name ${respMsg.isAlreadyExist}`
        };
        if (Object.keys(existErrors).length > 0) {
            return res.status(200).json({ result: false, message: existErrors })
        }
        if (req.body.id) {
            const findData = await prisma.pwd_tanks.findUnique({ where: { id: req.body.id, isDeleted: "N" }, select: { id: true } });
            if (!findData) {
                return res.status(200).json({ result: false, message: respMsg.noDataFound })
            }
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.pwd_tanks.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'PWD Tank ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.pwd_tanks.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'PWD Tank ' + respMsg.addedSuccess })
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getPWDTank = async (req, res) => {
    try {
        const { page, pageSize } = req.body;
        let queryFilter = { AND: [{ isDeleted: "N" }] };
        let records;
        let totalPages;
        if (page && pageSize) {
            const { searchFilter: { village, block, tankName } } = req.body;
            queryFilter.AND.push(
                ...(village ? [{ village: { contains: village } }] : []),
                ...(block ? [{ block: { contains: block } }] : []),
                ...(tankName ? [{ tankName: { contains: tankName } }] : []),
            );
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.pwd_tanks.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.pwd_tanks.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: select
            });
        } else {
            records = await prisma.pwd_tanks.findMany({
                where: queryFilter,
                select: select
            });
        }
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getPWDTankById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tankWB = await prisma.pwd_tanks.findFirst({ where: { id }, select: select });
        if (tankWB) {
            return res.json({ result: true, message: tankWB });
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const deletePWDTank = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedTankWB = await prisma.pwd_tanks.findUnique({ where: { id, isDeleted: "N" } });
        if (!deletedTankWB) {
            res.status(200).json({ result: false, message: respMsg.noDataFound });
        } else {
            await prisma.pwd_tanks.update({ where: { id: id }, data: { isDeleted: "Y" } });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'PWD Tank ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const importPWDTank = async (req, res) => {
    try {
        const file = req.files.file[0];
        if (!file) {
            return NextResponse.json({ result: false, message: 'No file uploaded' });
        }
        const pwdTankData = await parseExcelFile(file);
        for (const item of pwdTankData) {
            delete item.id
            const slug = generateSlug(item.tankName);
            item.slug = slug
            Object.keys(item).forEach(key => {
                item[key] = item[key] === null || item[key] === undefined ? "" : String(item[key]);
            });
            const isUniqueIdExist = await prisma.pwd_tanks.findFirst({ where: { uniqueId: item.uniqueId, isDeleted: "N", } });
            const isSlugExist = await prisma.pwd_tanks.findFirst({ where: { slug: slug, isDeleted: "N" } });
            item.updatedBy = String(req.user.id);
            item.updatedAt = new Date();
            if (!isUniqueIdExist && !isSlugExist) {
                item.slug = slug;
                item.createdBy = String(req.user.id);
                delete item.updatedBy;
                delete item.updatedAt;
                await prisma.pwd_tanks.create({ data: item });
            } else if (isUniqueIdExist && !isSlugExist) {
                await prisma.pwd_tanks.updateMany({ where: { uniqueId: item.uniqueId }, data: item });
            } else {
                await prisma.pwd_tanks.updateMany({ where: { slug: slug }, data: item });
            }
        }
        await updateApiDataVersion(req.user.id);
        return res.json({ result: true, message: 'PWD Tanks ' + respMsg.addedSuccess });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const downloadPWDTank = async (req, res) => {
    const modelName = 'pwd_tanks';
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
                village: true,
                block: true,
                taluk: true,
                district: true,
                subBasin: true,
                basin: true,
                section: true,
                subDn: true,
                division: true,
                circle: true,
                region: true,
                tankType: true,
                capacity: true,
                ftl: true,
                mwl: true,
                tbl: true,
                storageDepth: true,
                ayacut: true,
                catchmentArea: true,
                watSpread: true,
                noOfWeirs: true,
                weirLength: true,
                noOfSluices: true,
                lowestSill: true,
                bundLength: true,
                discharge: true,
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

module.exports = { upsertPWDTank, getPWDTank, getPWDTankById, deletePWDTank, importPWDTank, downloadPWDTank }