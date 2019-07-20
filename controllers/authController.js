const jwt = require('jsonwebtoken');

const userRepo = require('../repositories/userRepository');

const { isSignUpRequestValid, isSignInRequestValid } = require('../validators/signUpValidator');

function authController() {
  async function signIn(req, res) {
    const outcome = isSignInRequestValid(req.body);

    if (!outcome) {
      res.status(400);
      return res.json({ status: 'error', error: outcome.errors });
    }

    // validation passed
    // user was created
    try {
      const { rows } = await userRepo.getUserByEmail(req.body.email);

      const user = rows[0];

      if (user && userRepo.validatePassword(req.body.password, user.password)) {
        delete user.password;

        const token = jwt.sign({ user }, 'some_super_secret_key', {
          expiresIn: 86400 // expires in 24 hours
        });

        res.status(200);
        return res.json({
          status: 'success',
          data: {
            user_id: user.id,
            is_admin: user.is_admin,
            token,
            auth: true,
            user
          }
        });
      }

      res.status(400);

      return res.json({
        status: 'error',
        error: 'These credentials does not match our records, check the username and or email'
      });
    } catch (error) {
      // there was an error
      // user does not exist
      res.status(404);
      return res.json({
        status: 'error',
        error: 'These credentials does not match our records, check the username and or email'
      });
    }
  }

  async function signUp(req, res) {
    const outcome = isSignUpRequestValid(req.body);

    // validation failed
    if (!outcome.is_valid) {
      res.status(400);
      return res.json({ status: 'error', error: outcome.errors });
    }

    // validation passed
    // user was created
    try {
      const { rows } = await userRepo.createUser(req.body);
      const user = rows[0];

      delete user.password;

      const token = jwt.sign({ user }, 'some_super_secret_key', {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(201);
      return res.json({
        status: 'success',
        data: {
          user_id: user.id,
          is_admin: user.is_admin,
          token,
          auth: true,
          user
        }
      });
    } catch (error) {
      // there was an error
      // user creation failed
      res.status(500);
      return res.json({
        status: 'error',
        error: error.message
      });
    }
  }
  return { signIn, signUp };
}

module.exports = authController;
