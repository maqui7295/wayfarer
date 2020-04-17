// const express = require('express');
const Router = require('express-promise-router');
const authController = require('../controllers/authController')();

const {
  isSignUpRequestValid,
  isSignInRequestValid
} = require('../validators/authValidators');

const {
  checkOutcome
} = require('../validators/responses');

// const router = express.Router();
const router = new Router();

// middlewares
router.post('/auth/signup', (req, res, next) => {
  const outcome = isSignUpRequestValid(req.body);
  checkOutcome(outcome, res);
  next();
});

router.post('/auth/signin', (req, res, next) => {
  const outcome = isSignInRequestValid(req.body);
  checkOutcome(outcome, res);
  next();
});


router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);

module.exports = router;