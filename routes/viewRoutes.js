const express = require('express');

const { isLoggedIn, protect } = require('../controllers/authController');
const {
  getOverview,
  getTour,
  getSignupForm,
  getLoginForm,
  getAccount,
  getMyTours,
  updateUserData
} = require('../controllers/viewController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);

router.get('/signup', isLoggedIn, getSignupForm);

router.get('/login', isLoggedIn, getLoginForm);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/me', protect, getAccount);

// router.post('/submit-user-data', protect, updateUserData);

router.get('/my-tours', createBookingCheckout, protect, getMyTours);
module.exports = router;
