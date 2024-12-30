const express = require('express');
const router = express.Router();
const { validateMiddleware, parseFormData } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const PWDTankModel = require('../../models/PWDTankModel');
const { upsertPWDTank, getPWDTank, getPWDTankById, deletePWDTank, downloadPWDTank, importPWDTank } = require('../../controllers/PWDTankController');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(PWDTankModel), upsertPWDTank);
router.post('/get', verifyToken, getPWDTank);
router.get('/:id', verifyToken, getPWDTankById);
router.put('/:id', verifyToken, deletePWDTank);
router.post('/bulk-import', verifyToken, parseFormData, importPWDTank);
router.post('/bulk-download', verifyToken, downloadPWDTank);

module.exports = router;