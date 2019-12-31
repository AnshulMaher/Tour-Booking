const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReview,
  setTourUserIDs,
  createReview,
  getReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReview)
  .post(restrictTo('user'), setTourUserIDs, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
