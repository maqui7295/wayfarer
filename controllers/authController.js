const jwt = require('jsonwebtoken');

const userRepo = require('../repositories/userRepository');

const { isSignUpRequestValid } = require('../validators/signUpValidator');

function authController() {
  function signIn(req, res) {
    // if (error) {
    //   res.status(400);
    //   res.send('The request does not meet the required specification');
    // } else {
    //   res.status(200);
    //   return res.send('user created');
    // }
    res.send({});
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
      const user = await userRepo.createUser(req.body);

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

userRepo.closeConnection();

module.exports = authController;
