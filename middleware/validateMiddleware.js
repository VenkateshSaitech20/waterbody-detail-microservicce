const { formatErrors } = require("../utils/helper");
const formidable = require('formidable');
const path = require('path');

const validateMiddleware = (model) => async (req, res, next) => {
    try {
        const { error } = model.validate(req.body, { abortEarly: false });
        if (error) {
            const formattedErrors = formatErrors(error);
            return res.json({ result: false, message: formattedErrors });
        } else {
            next();
        }
    } catch (err) {
        res.json({ result: false, message: 'Something went wrong' });
    }
};

const parseFormData = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).json({ result: false, message: 'Error parsing form data' });
        }
        const cleanedFields = {};
        for (let field in fields) {
            try {
                if (field === 'waterParams' || field === 'gpsCordinates' || field === 'images') {
                    cleanedFields[field] = JSON.parse(fields[field][0]);
                } else {
                    cleanedFields[field] = fields[field][0] || '';
                }
            } catch (error) {
                cleanedFields[field] = fields[field][0] || '';
            }
        };
        req.body = cleanedFields;
        req.files = files;
        next();
    });
};

module.exports = { validateMiddleware, parseFormData };
