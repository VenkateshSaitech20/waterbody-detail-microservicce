const express = require('express');
const router = express.Router();
const { validateMiddleware, parseFormData } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const reviewModel = require('../../models/reviewModel');
const { upsertWaterBodyReview, getWaterPendingBodyReview, getWaterBodyReviewById, deleteWaterBodyReviewById, getApprovedWaterBodyReview, approveReview, getAllWaterBodyByUserId, getAllPendingWaterBodyByUserId, getAllApprovedWaterBodyByUserId } = require('../../controllers/reviewController');

router.post('/', verifyToken, trimRequestBody, parseFormData, validateMiddleware(reviewModel), upsertWaterBodyReview);
router.post('/get', verifyToken, getWaterPendingBodyReview);
router.post('/get-approved-reviews', verifyToken, getApprovedWaterBodyReview);
router.post('/get-all-waterbodies-by-user-id', verifyToken, getAllWaterBodyByUserId);
router.post('/get-all-pending-waterbodies-by-user-id', verifyToken, getAllPendingWaterBodyByUserId);
router.post('/get-all-approved-waterbodies-by-user-id', verifyToken, getAllApprovedWaterBodyByUserId);
router.get('/:id', verifyToken, getWaterBodyReviewById);
router.put('/:id', verifyToken, deleteWaterBodyReviewById);
router.post('/approve-review', verifyToken, approveReview);

module.exports = router;