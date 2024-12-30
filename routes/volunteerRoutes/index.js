const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const volunteerModel = require('../../models/volunteerModel');
const { upsertVolunteer, getVolunteer, downloadVolunteer } = require('../../controllers/volunteerController');

router.post('/registration', trimRequestBody, validateMiddleware(volunteerModel), upsertVolunteer);
router.post('/get', verifyToken, getVolunteer);
router.post('/bulk-download', verifyToken, downloadVolunteer);

module.exports = router;