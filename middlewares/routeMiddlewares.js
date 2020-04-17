const jwt = require('jsonwebtoken');

const {
  errorResponse
} = require('../validators/responses');

const {
  SECRET_KEY
} = require('../config/environment');

// Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];
    req.body.token = token;
    next();
  } else {
    errorResponse(res, 'Token not present or invalid token', 403);
  }
};

// verify the token and check if user is admin
const verifyToken = (req, res, next) => {
  try {
    const {
      user
    } = jwt.verify(req.body.token, SECRET_KEY);
    // we verify that it's the user that is making the request
    // eslint-disable-next-line no-unused-expressions
    (+req.body.user_id !== user.id) && errorResponse(res, 'user not found', 403);
    if (user.is_admin) {
      req.body.admin_confirmed = true;
    } else {
      req.body.admin_confirmed = false;
    }
    next();
  } catch (err) {
    errorResponse(res, err.message, 401);
  }
};

const isAdmin = (req, res, next) => {
  if (req.body.admin_confirmed) {
    next();
  } else {
    errorResponse(res, 'Forbidden', 403);
  }
};

module.exports = {
  checkToken,
  verifyToken,
  isAdmin
};