const isValid = require('./common');

// validator function
const isSignUpRequestValid = (data) => {
  const rules = {
    email: 'required|email',
    first_name: 'required|string',
    last_name: 'required|string',
    password: 'required|confirmed',
    password_confirmation: 'required|same:password'
  };
  return isValid(data, rules);
};

const isSignInRequestValid = (data) => {
  const rules = {
    email: 'required|email',
    password: 'required'
  };
  return isValid(data, rules);
};

module.exports = { isSignUpRequestValid, isSignInRequestValid };
