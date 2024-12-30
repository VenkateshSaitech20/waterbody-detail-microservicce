const Joi = require('joi');
const { patterns } = require('../../utils/pattern');
const respMsg = require('../../utils/message');

const volunteerModel = Joi.object({
    id: Joi.number(),
    name: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Name ${respMsg.defaultNameValMsg}`,
        'any.required': `Name ${respMsg.defaultReq}`,
        'string.empty': `Name ${respMsg.defaultReq}`,
    }),
    mobile: Joi.string().trim().pattern(patterns.mobile).required().messages({
        'string.pattern.base': respMsg.mobileValMsg,
        'any.required': respMsg.mobReq,
        'string.empty': respMsg.mobReq
    }),
    email: Joi.string().trim().pattern(patterns.emailPattern).required().messages({
        'string.pattern.base': respMsg.emailValMsg,
        'any.required': respMsg.emailReq,
        'string.empty': respMsg.emailReq,
    }),
    volunteeringFor: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Volunteer ${respMsg.defaultNameValMsg}`,
        'any.required': `Volunteer ${respMsg.defaultReq}`,
        'string.empty': `Volunteer ${respMsg.defaultReq}`,
    }),
    taluk: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Taluk ${respMsg.defaultNameValMsg}`,
        'any.required': `Taluk ${respMsg.defaultReq}`,
        'string.empty': `Taluk ${respMsg.defaultReq}`,
    }),
    block: Joi.string().trim().pattern(patterns.name).required().messages({
        'string.pattern.base': `Block ${respMsg.defaultNameValMsg}`,
        'any.required': `Block ${respMsg.defaultReq}`,
        'string.empty': `Block ${respMsg.defaultReq}`,
    }),
});

module.exports = volunteerModel;
