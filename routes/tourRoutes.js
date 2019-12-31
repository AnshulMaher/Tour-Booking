const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const { protect, restrictTo } = require('../controllers/authController');
const {
  aliasTopTours,
  getAllTours,
  createTour,
  getTour,
  uploadTourImages,
  resizeTourImages,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
} = require('../controllers/tourController');

const router = express.Router();

// Parameterised Middleware i.e. run automatically for requests with id parameter
// to check valid id
// router.param('id', checkID);

//----------------- Routes -----------------//

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/top-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

//------------------ End -----------------//

module.exports = router;
