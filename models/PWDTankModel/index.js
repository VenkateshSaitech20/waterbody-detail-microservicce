const Joi = require('joi');
const { patterns } = require('../../utils/pattern');
const respMsg = require('../../utils/message');

const reviewModel = Joi.object({
    id: Joi.number(),
    uniqueId: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': `Unique Id ${respMsg.defaultNameWithNumaricValMsg}`,
        'any.required': `Unique Id ${respMsg.defaultReq}`,
        'string.empty': `Unique Id ${respMsg.defaultReq}`,
    }),
    tankName: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Tank Name ${respMsg.defaultNameValMsg}`,
        'any.required': `Tank Name ${respMsg.defaultReq}`,
        'string.empty': `Tank Name ${respMsg.defaultReq}`
    }),
    district: Joi.string().trim().required().messages({
        'string.base': `District ${respMsg.defaultNameValMsg}`,
        'any.required': `District ${respMsg.defaultReq}`,
        'string.empty': `District ${respMsg.defaultReq}`
    }),
    taluk: Joi.string().trim().required().messages({
        'string.base': `Taluk ${respMsg.defaultNameValMsg}`,
        'any.required': `Taluk ${respMsg.defaultReq}`,
        'string.empty': `Taluk ${respMsg.defaultReq}`
    }),
    block: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Block ${respMsg.defaultNameValMsg}`,
        'any.required': `Block ${respMsg.defaultReq}`,
        'string.empty': `Block ${respMsg.defaultReq}`,
    }),
    village: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Village ${respMsg.defaultNameValMsg}`,
        'any.required': `Village ${respMsg.defaultReq}`,
        'string.empty': `Village ${respMsg.defaultReq}`,
    }),
    subBasin: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Sub Basin ${respMsg.defaultNameValMsg}`,
        'any.required': `Sub Basin ${respMsg.defaultReq}`,
        'string.empty': `Sub Basin ${respMsg.defaultReq}`,
    }),
    basin: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Basin ${respMsg.defaultNameValMsg}`,
        'any.required': `Basin ${respMsg.defaultReq}`,
        'string.empty': `Basin ${respMsg.defaultReq}`,
    }),
    section: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': `Section ${respMsg.defaultNameWithNumaricValMsg}`,
        'any.required': `Section ${respMsg.defaultReq}`,
        'string.empty': `Section ${respMsg.defaultReq}`,
    }),
    subDn: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': `Sub Dn ${respMsg.defaultNameWithNumaricValMsg}`,
        'any.required': `Sub Dn ${respMsg.defaultReq}`,
        'string.empty': `Sub Dn ${respMsg.defaultReq}`,
    }),
    division: Joi.string().trim().pattern(patterns.nameWithComma).required().messages({
        'string.pattern.base': `Division ${respMsg.defaultNamewithCommaValMsg}`,
        'any.required': `Division ${respMsg.defaultReq}`,
        'string.empty': `Division ${respMsg.defaultReq}`,
    }),
    circle: Joi.string().allow(''),
    region: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Region ${respMsg.defaultNameValMsg}`,
        'any.required': `Region ${respMsg.defaultReq}`,
        'string.empty': `Region ${respMsg.defaultReq}`,
    }),
    tankType: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Tank Type ${respMsg.defaultNameValMsg}`,
        'any.required': `Tank Type ${respMsg.defaultReq}`,
        'string.empty': `Tank Type ${respMsg.defaultReq}`,
    }),
    capacity: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Capacity ${respMsg.defaultNumberValMsg}`,
        'any.required': `Capacity ${respMsg.defaultReq}`,
        'string.empty': `Capacity ${respMsg.defaultReq}`,
    }),
    ftl: Joi.string().trim().allow(''),
    mwl: Joi.string().trim().allow(''),
    tbl: Joi.string().trim().allow(''),
    storageDepth: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Storage Depth ${respMsg.defaultNumberValMsg}`,
        'any.required': `Storage Depth ${respMsg.defaultReq}`,
        'string.empty': `Storage Depth ${respMsg.defaultReq}`,
    }),
    ayacut: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Ayacut ${respMsg.defaultNumberValMsg}`,
        'any.required': `Ayacut ${respMsg.defaultReq}`,
        'string.empty': `Ayacut ${respMsg.defaultReq}`,
    }),
    catchmentArea: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Catchment Area ${respMsg.defaultNumberValMsg}`,
        'any.required': `Catchment Area ${respMsg.defaultReq}`,
        'string.empty': `Catchment Area ${respMsg.defaultReq}`,
    }),
    watSpread: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Wat Spread ${respMsg.defaultNumberValMsg}`,
        'any.required': `Wat Spread ${respMsg.defaultReq}`,
        'string.empty': `Wat Spread ${respMsg.defaultReq}`,
    }),
    noOfWeirs: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `No Of Weirs ${respMsg.defaultNumberValMsg}`,
        'any.required': `No Of Weirs ${respMsg.defaultReq}`,
        'string.empty': `No Of Weirs ${respMsg.defaultReq}`,
    }),
    weirLength: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Weir Length ${respMsg.defaultNumberValMsg}`,
        'any.required': `Weir Length ${respMsg.defaultReq}`,
        'string.empty': `Weir Length ${respMsg.defaultReq}`,
    }),
    noOfSluices: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `No Of Sluices ${respMsg.defaultNumberValMsg}`,
        'any.required': `No Of Sluices ${respMsg.defaultReq}`,
        'string.empty': `No Of Sluices ${respMsg.defaultReq}`,
    }),
    lowestSill: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Lowest Sill ${respMsg.defaultNumberValMsg}`,
        'any.required': `Lowest Sill ${respMsg.defaultReq}`,
        'string.empty': `Lowest Sill ${respMsg.defaultReq}`,
    }),
    bundLength: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Bund Length ${respMsg.defaultNumberValMsg}`,
        'any.required': `Bund Length ${respMsg.defaultReq}`,
        'string.empty': `Bund Length ${respMsg.defaultReq}`,
    }),
    discharge: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Discharge ${respMsg.defaultNumberValMsg}`,
        'any.required': `Discharge ${respMsg.defaultReq}`,
        'string.empty': `Discharge ${respMsg.defaultReq}`,
    }),
});

module.exports = reviewModel;
