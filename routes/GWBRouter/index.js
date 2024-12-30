const express = require('express');
const router = express.Router();
const { validateMiddleware, parseFormData } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const GWBModel = require('../../models/GWBModel');
const { upsertGovernmentWaterBody, deleteGovernmentWaterBody, getGovernmentWaterBodyById, getGovernmentWaterBody, importGovernmentWaterBody, downloadGovernmentWaterBody } = require('../../controllers/GWBController');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(GWBModel), upsertGovernmentWaterBody);
router.post('/get', verifyToken, getGovernmentWaterBody);
router.get('/:id', verifyToken, getGovernmentWaterBodyById);
router.put('/:id', verifyToken, deleteGovernmentWaterBody);
router.post('/bulk-import', verifyToken, parseFormData, importGovernmentWaterBody);
router.post('/bulk-download', verifyToken, downloadGovernmentWaterBody);

module.exports = router;