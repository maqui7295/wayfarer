const jwt = require('jsonwebtoken');

const userRepo = require('../repositories/busRepository');

const {
  isCreateBusRequestValid,
  checkOutcome,
  successResponse,
  errorResponse
} = require('../validators/request_validators');

function authController() {
  const secretKey = 'some_super_secret_key';
  const loginErrorMsg = 'These credentials does not match our records, check the username and or email';

  async function createBus(req, res) {
    const outcome = isCreateBusRequestValid(req.body);
    checkOutcome(outcome, res);
    // validation passed
    try {
      const {
        rows
      } = await userRepo.getUserByEmail(req.body.email);
      const user = rows[0];
      if (user && userRepo.validatePassword(req.body.password, user.password)) {
        const token = jwt.sign({
          user
        }, secretKey, {
          expiresIn: 86400 // expires in 24 hours
        });
        authSuccessResponse(res, user, token, 200);
      }
      // there was an error // user does not exist
      errorResponse(res, loginErrorMsg, 401);
    } catch (error) {
      // there was a network error or so
      errorResponse(res, `Network error (${error.message})`, 500);
    }
  }
  return Object.freeze({
    createBus
  });
}

module.exports = authController;