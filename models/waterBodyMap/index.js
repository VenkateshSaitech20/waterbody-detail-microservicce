const Joi = require('joi');
const { patterns } = require('../../utils/pattern');
const respMsg = require('../../utils/message');

const waterBodyMapModel = Joi.object({
    id: Joi.number(),
    district: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': respMsg.districtValMsg,
        'any.required': respMsg.districtReq,
        'string.empty': respMsg.districtReq
    }),
    slugName: Joi.string().trim(),
    geoJsonFiles: Joi.object({
        filename: Joi.string().required(),
        path: Joi.string()
    }).optional()
});

module.exports = waterBodyMapModel;
