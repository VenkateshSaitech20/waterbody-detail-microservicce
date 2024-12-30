const express = require('express');
const router = express.Router();
const { validateMiddleware, parseFormData } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const waterBodyMapModel = require('../../models/waterBodyMap');
const { upsertWaterBodyMap, getWaterBodyMap } = require('../../controllers/waterBodyMap');

router.post('/', verifyToken, trimRequestBody, parseFormData, validateMiddleware(waterBodyMapModel), upsertWaterBodyMap);
router.post('/get', trimRequestBody, getWaterBodyMap);

module.exports = router;