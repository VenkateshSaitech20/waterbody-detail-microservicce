const express = require('express');
const router = express.Router();
const { validateMiddleware, parseFormData } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const tankWBModel = require('../../models/tankWBModel');
const { upsertTankWB, getTankWB, getTankWBById, deleteTankWB, downloadTankWB, importTankWB } = require('../../controllers/tankWBController');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(tankWBModel), upsertTankWB);
router.post('/get', verifyToken, getTankWB);
router.get('/:id', verifyToken, getTankWBById);
router.put('/:id', verifyToken, deleteTankWB);
router.post('/bulk-import', verifyToken, parseFormData, importTankWB);
router.post('/bulk-download', verifyToken, downloadTankWB);

module.exports = router;