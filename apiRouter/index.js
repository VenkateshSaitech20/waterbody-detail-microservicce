const express = require('express');
const router = express.Router();

const waterBodyMapRouter = require('../routes/waterBodyMapRouter/index');
const GWBRouter = require('../routes/GWBRouter/index');
const reviewRouter = require('../routes/reviewRouter/index');
const tankWBRouter = require('../routes/tankWBRouter/index');
const pwdTankRouter = require('../routes/pwdTankRouter/index');
const WBCountRouter = require('../routes/dashboard/WBCountRouter/index');
const volunteerRoutes = require('../routes/volunteerRoutes/index');
const generateWaterBodyIdRouter = require('../routes/generateWaterBodyIdRouter');

router.use('/water-body/map', waterBodyMapRouter);
router.use('/water-body-details/gwb', GWBRouter);
router.use('/water-body-details/review', reviewRouter);
router.use('/tank-water-bodies', tankWBRouter);
router.use('/pwd-tanks', pwdTankRouter);
router.use('/dashboard/wbd-count', WBCountRouter);
router.use('/volunteer', volunteerRoutes);
router.use('/generate-water-body-id', generateWaterBodyIdRouter);

module.exports = router;