const express = require('express');
const { getDashBoardWBData } = require('../../../controllers/dashboard/WBCountContoller');
const router = express.Router();

router.get('/get', getDashBoardWBData);

module.exports = router;
