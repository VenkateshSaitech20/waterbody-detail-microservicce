const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { downloadExcel } = require('../../utils/helper');
const prisma = new PrismaClient();

const select = { name: true, mobile: true, email: true, volunteeringFor: true, taluk: true, block: true };

const upsertVolunteer = async (req, res) => {
    try {
        await prisma.volunteers.create({ data: req.body });
        return res.json({ result: true, message: 'Registered Successfully' })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ result: false, message: error });
    }
}

const getVolunteer = async (req, res) => {
    try {
        const { searchText, page, pageSize } = req.body;
        let records;
        let totalPages;
        const queryFilter = {
            AND: [
                ...(searchText ? [
                    {
                        OR: [
                            { name: { contains: searchText } },
                            { mobile: { contains: searchText } },
                            { email: { contains: searchText } },
                            { volunteeringFor: { contains: searchText } },
                            { taluk: { contains: searchText } },
                            { block: { contains: searchText } },
                        ]
                    }
                ] : [])
            ]
        };
        let skip = (page - 1) * pageSize;
        const totalCount = await prisma.volunteers.count({ where: queryFilter });
        if (skip >= totalCount) {
            skip = totalCount - pageSize;
        }
        if (skip < 0) skip = 0;
        totalPages = Math.ceil(totalCount / pageSize);
        records = await prisma.volunteers.findMany({
            where: queryFilter,
            skip,
            take: pageSize,
            select: select
        });
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        console.log(error)
        return res.status(200).json({ result: false, message: error });
    }
}

const downloadVolunteer = async (req, res) => {
    const modelName = 'volunteers';
    if (!modelName) {
        return res.status(400).json({ result: false, message: 'Model name is required' });
    };
    try {
        const model = prisma[modelName];
        if (!model) {
            return res.status(400).json({ result: false, message: `${modelName} does not exist` });
        }
        const data = await model.findMany({
            select: {
                name: true,
                mobile: true,
                email: true,
                volunteeringFor: true,
                taluk: true,
                block: true,
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

module.exports = { upsertVolunteer, getVolunteer, downloadVolunteer }