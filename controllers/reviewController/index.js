const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { updateApiDataVersion } = require('../../utils/api-data-version');

const prisma = new PrismaClient();

const select = { id: true, surveyNumber: true, waterBodyType: true, waterBodyId: true, waterBodyName: true, waterBodyAvailability: true, district: true, taluk: true, block: true, panchayat: true, village: true, jurisdiction: true, verifyStatus: true, name: true, ward: true };

async function handleFilter(searchFilter) {
    try {
        if (searchFilter?.jurisdiction) {
            const jurisdiction = await prisma.jurisdictions.findUnique({
                where: { id: parseInt(searchFilter.jurisdiction), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.jurisdiction = jurisdiction?.name || "";
        }
        if (searchFilter?.district) {
            const district = await prisma.district.findUnique({
                where: { id: parseInt(searchFilter.district), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.district = district?.name || "";
        }
        if (searchFilter?.taluk) {
            const taluk = await prisma.taluks.findUnique({
                where: { id: parseInt(searchFilter.taluk), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.taluk = taluk?.name || "";
        }
        if (searchFilter?.block) {
            const block = await prisma.block.findUnique({
                where: { id: parseInt(searchFilter.block), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.block = block?.name || "";
        }
        if (searchFilter?.village) {
            const village = await prisma.panchayats.findUnique({
                where: { id: parseInt(searchFilter.village), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.village = village?.name || "";
        }
        if (searchFilter?.habitation) {
            const habitation = await prisma.habitations.findUnique({
                where: { id: parseInt(searchFilter.habitation), isDeleted: "N", isActive: "Y" },
                select: { name: true },
            });
            searchFilter.habitation = habitation?.name || "";
        }
        return searchFilter;
    } catch (error) {
        throw new Error(`Error in filterQuery: ${error.message}`);
    }
}

function handleQueryFilter(searchFilter) {
    const dynamicFilters = [
        ...(searchFilter?.jurisdiction ? [{ jurisdiction: { contains: searchFilter.jurisdiction } }] : []),
        ...(searchFilter?.district ? [{ district: { contains: searchFilter.district } }] : []),
        ...(searchFilter?.taluk ? [{ taluk: { contains: searchFilter.taluk } }] : []),
        ...(searchFilter?.block ? [{ block: { contains: searchFilter.block } }] : []),
        ...(searchFilter?.village ? [{ village: { contains: searchFilter.village } }] : []),
        ...(searchFilter?.waterBodyId ? [{ waterBodyId: { contains: searchFilter.waterBodyId } }] : []),
        ...(searchFilter?.name ? [{ name: { contains: searchFilter.name } }] : []),
        ...(searchFilter?.ward ? [{ ward: { contains: searchFilter.ward } }] : []),
        ...(searchFilter?.habitation ? [{ ["waterParams.habitation"]: { contains: searchFilter.habitation } }] : []),
    ];
    return dynamicFilters;
}

const upsertWaterBodyReview = async (req, res) => {
    try {
        if (typeof req.body.waterBodyAvailability === 'string') {
            req.body.waterBodyAvailability = JSON.parse(req.body.waterBodyAvailability.toLowerCase());
        };
        req.body.draftStatus = Number(req.body.draftStatus);
        req.body.verifyStatus = Number(req.body.verifyStatus);
        if (req.body.id) { req.body.id = Number(req.body.id) }
        const existErrors = {};
        const existSurvayNumber = await prisma.water_body_reviews.findFirst({ where: { surveyNumber: req.body.surveyNumber, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { surveyNumber: true } });
        if (existSurvayNumber) {
            existErrors.surveyNumber = `Survey Number ${respMsg.isAlreadyExist}`
        };
        const existsWaterBodyId = await prisma.water_body_reviews.findFirst({ where: { waterBodyId: req.body.waterBodyId, isDeleted: "N", ...(req.body.id ? { NOT: { id: req.body.id } } : {}) }, select: { surveyNumber: true } });
        if (existsWaterBodyId) {
            existErrors.existsWaterBodyId = `Water Body Id ${respMsg.isAlreadyExist}`
        };
        if (Object.keys(existErrors).length > 0) {
            return res.status(200).json({ result: false, message: existErrors })
        }
        if (req.body.id) {
            const findData = await prisma.water_body_reviews.findUnique({ where: { id: req.body.id, isDeleted: "N" }, select: { id: true } });
            if (!findData) {
                return res.status(200).json({ result: false, message: respMsg.noDataFound })
            }
            req.body.id = parseInt(req.body.id);
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.water_body_reviews.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Review ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.water_body_reviews.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Review ' + respMsg.addedSuccess })
        };
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getWaterPendingBodyReview = async (req, res) => {
    try {
        let { searchFilter, page, pageSize } = req.body;
        searchFilter = await handleFilter(searchFilter || {});
        let queryFilter = {
            AND: [
                { isDeleted: "N" },
                { verifyStatus: 0 },
                ...handleQueryFilter(searchFilter),
            ],
        };
        let records;
        let totalPages;
        if (page && pageSize) {
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.water_body_reviews.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.water_body_reviews.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: select
            });
        } else {
            records = await prisma.water_body_reviews.findMany({
                where: queryFilter,
                select: select
            });
        }
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getApprovedWaterBodyReview = async (req, res) => {
    try {
        let { searchFilter, page, pageSize } = req.body;
        searchFilter = await handleFilter(searchFilter || {});
        let queryFilter = {
            AND: [
                { isDeleted: "N" },
                { verifyStatus: 1 },
                ...handleQueryFilter(searchFilter),
            ],
        };
        let records;
        let totalPages;
        if (page && pageSize) {
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.water_body_reviews.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.water_body_reviews.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: select
            });
        } else {
            records = await prisma.water_body_reviews.findMany({
                where: queryFilter,
                select: select
            });
        }
        return res.json({ result: true, message: records, totalPages });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getWaterBodyReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const getAllReviews = await prisma.water_body_reviews.findUnique({ where: { id: id, isDeleted: "N" }, select: { ...select, waterParams: true, gpsCordinates: true, images: true } });
        if (!getAllReviews) {
            return res.status(200).json({ result: false, message: respMsg.noDataFound });
        }
        return res.status(200).json({ result: true, message: getAllReviews });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

const getAllPendingWaterBodyByUserId = async (req, res) => {
    try {
        let { searchFilter } = req.body;
        searchFilter = await handleFilter(searchFilter || {});
        let queryFilter = {
            AND: [
                { isDeleted: "N" },
                { verifyStatus: 0 },
                { createdBy: req.user.id },
                ...handleQueryFilter(searchFilter),
            ],
        };
        let records;
        records = await prisma.water_body_reviews.findMany({
            where: queryFilter,
            select: select
        });
        return res.json({ result: true, message: records });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getAllApprovedWaterBodyByUserId = async (req, res) => {
    try {
        let { searchFilter } = req.body;
        searchFilter = await handleFilter(searchFilter || {});
        let queryFilter = {
            AND: [
                { isDeleted: "N" },
                { verifyStatus: 1 },
                { createdBy: req.user.id },
                ...handleQueryFilter(searchFilter),
            ],
        };
        let records;
        records = await prisma.water_body_reviews.findMany({
            where: queryFilter,
            select: select
        });
        return res.json({ result: true, message: records });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getAllWaterBodyByUserId = async (req, res) => {
    try {
        let { searchFilter } = req.body;
        searchFilter = await handleFilter(searchFilter || {});
        let queryFilter = {
            AND: [
                { isDeleted: "N" },
                { createdBy: req.user.id },
                ...handleQueryFilter(searchFilter),
            ],
        };
        let records;
        records = await prisma.water_body_reviews.findMany({
            where: queryFilter,
            select: select
        });
        return res.json({ result: true, message: records });
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const deleteWaterBodyReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedGWB = await prisma.water_body_reviews.findUnique({ where: { id, isDeleted: "N" }, select: { id: true } });
        if (!deletedGWB) {
            res.status(200).json({ result: false, message: respMsg.noDataFound });
        } else {
            await prisma.water_body_reviews.update({ where: { id: id }, data: { isDeleted: "Y" } });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Review ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const approveReview = async (req, res) => {
    try {
        const review = await prisma.water_body_reviews.findUnique({
            where: { id: req.body.id, isDeleted: "N", verifyStatus: 0 }
        });
        if (!review) {
            return res.status(200).json({ result: false, message: respMsg.noDataFound });
        } else {
            await prisma.water_body_reviews.update({ where: { id: req.body.id, isDeleted: "N" }, data: { verifyStatus: req.body.value } });
            await updateApiDataVersion(req.user.id);
            return res.status(200).json({ result: true, message: respMsg.reviewApproved });
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error })
    }
}

module.exports = { upsertWaterBodyReview, getWaterPendingBodyReview, getApprovedWaterBodyReview, getWaterBodyReviewById, deleteWaterBodyReviewById, approveReview, getAllWaterBodyByUserId, getAllPendingWaterBodyByUserId, getAllApprovedWaterBodyByUserId }