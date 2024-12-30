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
    block: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Block ${respMsg.defaultNameValMsg}`,
        'any.required': `Block ${respMsg.defaultReq}`,
        'string.empty': `Block ${respMsg.defaultReq}`,
    }),
    panchayat: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Panchayat ${respMsg.defaultNameValMsg}`,
        'any.required': `Panchayat ${respMsg.defaultReq}`,
        'string.empty': `Panchayat ${respMsg.defaultReq}`,
    }),
    village: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Village ${respMsg.defaultNameValMsg}`,
        'any.required': `Village ${respMsg.defaultReq}`,
        'string.empty': `Village ${respMsg.defaultReq}`,
    }),
    tankType: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Tank Type ${respMsg.defaultNameValMsg}`,
        'any.required': `Tank Type ${respMsg.defaultReq}`,
        'string.empty': `Tank Type ${respMsg.defaultReq}`,
    }),
    ayacut: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Ayacut ${respMsg.defaultNumberValMsg}`,
        'any.required': `Ayacut ${respMsg.defaultReq}`,
        'string.empty': `Ayacut ${respMsg.defaultReq}`,
    }),
    watSprAr: Joi.string().trim().allow(''),
    capMcm: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `CAP MCM ${respMsg.defaultNumberValMsg}`,
        'any.required': `CAP MCM ${respMsg.defaultReq}`,
        'string.empty': `CAP MCM ${respMsg.defaultReq}`,
    }),
    noOfSluices: Joi.string().trim().allow(''),
    sluicesType: Joi.string().trim().allow(''),
    bundLength: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `Bund Length ${respMsg.defaultNumberValMsg}`,
        'any.required': `Bund Length ${respMsg.defaultReq}`,
        'string.empty': `Bund Length ${respMsg.defaultReq}`,
    }),
    tbl: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `TBL ${respMsg.defaultNumberValMsg}`,
        'any.required': `TBL ${respMsg.defaultReq}`,
        'string.empty': `TBL ${respMsg.defaultReq}`,
    }),
    mwl: Joi.string().allow(''),
    ftl: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': `FTL ${respMsg.defaultNumberValMsg}`,
        'any.required': `FTL ${respMsg.defaultReq}`,
        'string.empty': `FTL ${respMsg.defaultReq}`,
    }),
    stoDepth: Joi.string().trim().allow(''),
    catchment: Joi.string().trim().allow(''),
    noOFWeirs: Joi.string().trim().allow(''),
    weirLength: Joi.string().trim().allow(''),
    lowSill: Joi.string().trim().allow(''),
    disCusecs: Joi.string().trim().allow(''),
});

module.exports = reviewModel;
