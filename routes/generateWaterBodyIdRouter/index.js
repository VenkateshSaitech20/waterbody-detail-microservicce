const express = require('express');
const router = express.Router();
const { generateWaterBodyId } = require('../../controllers/generateWaterBodyIdController');

router.get('/', generateWaterBodyId);

module.exports = router;