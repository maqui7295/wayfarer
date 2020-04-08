const jwt = require('jsonwebtoken');

const userRepo = require('../repositories/userRepository');

const {
  isSignUpRequestValid,
  isSignInRequestValid
} = require('../validators/request_validators');

function authController() {
  const secretKey = 'some_super_secret_key';
  const loginErrorMsg = 'These credentials does not match our records, check the username and or email';

  // eslint-disable-next-line consistent-return
  const checkOutcome = (outcome, res) => {
    if (!outcome.is_valid) {
      res.status(422);
      return res.json({
        status: 'error',
        error: outcome.errors
      });
    }
  };

  // eslint-disable-next-line arrow-body-style
  const successResponse = (res, user, token, status) => {
    res.status(status);
    return res.json({
      status: 'success',
      data: {
        user_id: user.id,
        is_admin: user.is_admin,
        token,
        auth: true
      }
    });
  };

  const errorResponse = (res, message, status) => {
    res.status(status);
    return res.json({
      status: 'error',
      error: message
    });
  };

  async function signIn(req, res) {
    const outcome = isSignInRequestValid(req.body);
    checkOutcome(outcome, res);
    // validation passed
    try {
      const {
        rows
      } = await userRepo.getUserByEmail(req.body.email);
      const user = rows[0];

      if (user && userRepo.validatePassword(req.body.password, user.password)) {
        delete user.password;
        const token = jwt.sign({
          user
        }, secretKey, {
          expiresIn: 86400 // expires in 24 hours
        });
        successResponse(res, user, token, 200);
      }
      // there was an error // user does not exist
      errorResponse(res, loginErrorMsg, 401);
    } catch (error) {
      // there was a network error or so
      errorResponse(res, `Network error (${error.message})`, 500);
    }
  }

  async function signUp(req, res) {
    const outcome = isSignUpRequestValid(req.body);
    checkOutcome(outcome, res);
    // validation passed
    try {
      if (await userRepo.userExists(req.body.email)) {
        errorResponse(res, 'email has been taken!', 422);
      }
      const {
        rows
      } = await userRepo.createUser(req.body);
      const user = rows[0];
      delete user.password;

      const token = jwt.sign({
        user
      }, secretKey, {
        expiresIn: 86400 // expires in 24 hours
      });
      successResponse(res, user, token, 201);
    } catch (error) {
      // there was an error, user creation failed
      errorResponse(res, `Network error (${error.message})`, 500);
    }
  }
  return Object.freeze({
    signIn,
    signUp
  });
}

module.exports = authController;