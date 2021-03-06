const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const {
  errorResponse
} = require('../validators/responses');

const {
  SECRET_KEY
} = require('../config/environment');

function authController() {
  const loginErrorMsg = 'These credentials does not match our records, check the username and or email';

  const createUserToken = (user, key = SECRET_KEY, duration = 60 * 60 * 24 /* 24 hours */ ) => {
    // TODO: Write test to ensure that the user password field is not avalable
    const token = jwt.sign({
      user
    }, key, {
      expiresIn: duration // expires in 24 hours
    });
    return token;
  };

  // eslint-disable-next-line arrow-body-style
  const authsuccessData = (user) => {
    const data = {
      user_id: user.id,
      is_admin: user.is_admin,
      token: createUserToken(user),
      auth: true,
    };
    return data;
  };

  async function signIn(req, res) {
    try {
      const user = await userRepo.findUserByEmail(req.body.email);
      if (user && userRepo.validatePassword(req.body.password, user.password)) {
        delete user.password;
        res.status(200);
        return res.json(authsuccessData(user));
      }
      // there was an error // user does not exist
      return errorResponse(res, loginErrorMsg, 401);
    } catch (error) {
      // there was a network error or so
      return errorResponse(res, `Network error (${error.message})`, 500);
    }
  }

  async function signUp(req, res) {
    try {
      if (await userRepo.userExists(req.body.email)) {
        errorResponse(res, 'email has been taken!', 422);
      }
      const user = await userRepo.createUser(req.body);
      res.status(201);
      return res.json(authsuccessData(user));
    } catch (error) {
      // there was an error (network), user creation failed
      return errorResponse(res, `Network error (${error.message})`, 500);
    }
  }
  return Object.freeze({
    signIn,
    signUp
  });
}

module.exports = authController;