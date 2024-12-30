const Joi = require('joi');
const { patterns } = require('../../utils/pattern');
const respMsg = require('../../utils/message');

const GWBModel = Joi.object({
    id: Joi.number(),
    uniqueId: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).required().messages({
        'string.pattern.base': respMsg.uniqueIdValMsg,
        'any.required': respMsg.uniqueIdReq,
        'string.empty': respMsg.uniqueIdReq
    }),
    pond: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': respMsg.pondValMsg,
        'any.required': respMsg.pondReq,
        'string.empty': respMsg.pondReq
    }),
    latitude: Joi.string().trim().pattern(patterns.numWithDot).required().messages({
        'string.pattern.base': respMsg.latitudeValMsg,
        'any.required': respMsg.latitudeReq,
        'string.empty': respMsg.latitudeReq
    }),
    longitude: Joi.string().trim().pattern(patterns.numWithDot).required().messages({
        'string.pattern.base': respMsg.longitudeValMsg,
        'any.required': respMsg.longitudeReq,
        'string.empty': respMsg.longitudeReq
    }),
    taluk: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': respMsg.talukValMsg,
        'any.required': respMsg.talukReq,
        'string.empty': respMsg.talukReq
    }),
    village: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': respMsg.villageValMsg,
        'any.required': respMsg.villageReq,
        'string.empty': respMsg.villageReq
    }),
});

module.exports = GWBModel;
