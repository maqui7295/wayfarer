// const express = require('express');
const Router = require('express-promise-router');
const authController = require('../controllers/authController')();

// const router = express.Router();
const router = new Router();

router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);

module.exports = router;
