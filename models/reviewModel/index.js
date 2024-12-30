const Joi = require('joi');
const { patterns } = require('../../utils/pattern');
const respMsg = require('../../utils/message');

const reviewModel = Joi.object({
    id: Joi.number(),
    surveyNumber: Joi.string().trim().pattern(patterns.number).required().messages({
        'string.pattern.base': `Survey Number ${respMsg.defaultNameValMsg}`,
        'any.required': `Survey Number ${respMsg.defaultReq}`,
        'string.empty': `Survey Number ${respMsg.defaultReq}`,
    }),
    waterBodyType: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Water Body Type ${respMsg.defaultNameValMsg}`,
        'any.required': `Water Body Type ${respMsg.defaultReq}`,
        'string.empty': `Water Body Type ${respMsg.defaultReq}`
    }),
    waterBodyAvailability: Joi.boolean().valid(true, false).required().messages({
        'boolean.base': `Water Body Availability ${respMsg.defaultBooleanValMsg}`,
        'any.required': `water Body Availability ${respMsg.defaultReq}`,
        'string.empty': `Water Body Availability ${respMsg.defaultReq}`
    }),
    waterBodyId: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': `Water Body Id ${respMsg.defaultNameValMsg}`,
        'any.required': `Water Body Id ${respMsg.defaultReq}`,
        'string.empty': `Water Body Id ${respMsg.defaultReq}`,
    }),
    waterBodyName: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Water Body Name ${respMsg.defaultNameValMsg}`,
        'any.required': `Water Body Name ${respMsg.defaultReq}`,
        'string.empty': `Water Body Name ${respMsg.defaultReq}`,
    }),
    district: Joi.string().pattern(patterns.name).allow('').messages({
        'string.pattern.base': `District ${respMsg.defaultNameValMsg}`
    }),
    taluk: Joi.string().pattern(patterns.name).allow('').messages({
        'string.pattern.base': `Taluk ${respMsg.defaultNameValMsg}`
    }),
    block: Joi.string().pattern(patterns.name).allow('').messages({
        'string.pattern.base': `Block ${respMsg.defaultNameValMsg}`
    }),
    panchayat: Joi.string().pattern(patterns.name).allow('').messages({
        'string.pattern.base': `Panchayat ${respMsg.defaultNameValMsg}`
    }),
    village: Joi.string().pattern(patterns.name).allow('').messages({
        'string.pattern.base': `Village ${respMsg.defaultNameValMsg}`
    }),
    jurisdiction: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Jurisdiction ${respMsg.defaultNameValMsg}`,
        'any.required': `Jurisdiction ${respMsg.defaultReq}`,
        'string.empty': `Jurisdiction ${respMsg.defaultReq}`,
    }),
    name: Joi.string().trim().pattern(patterns.name).messages({
        'string.pattern.base': `Name ${respMsg.defaultNameValMsg}`
    }),
    ward: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': `Ward ${respMsg.defaultNameWithNumaricValMsg}`,
        'any.required': `Ward ${respMsg.defaultReq}`,
        'string.empty': `Ward ${respMsg.defaultReq}`,
    }),
    draftStatus: Joi.number(),
    verifyStatus: Joi.number(),
    waterParams: Joi.object().pattern(/^/, Joi.any()).optional(),
    gpsCordinates: Joi.array().items(
        Joi.object({
            lat: Joi.string().required(),
            long: Joi.string().required(),
            point: Joi.string(),
        })
    ).optional(),
    images: Joi.array().items(
        Joi.object({
            id: Joi.string().optional(),
            image: Joi.string().required().messages({
                'any.required': `Image ${respMsg.defaultReq}`,
            }),
            description: Joi.string().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        })
    ).optional()
});

module.exports = reviewModel;
