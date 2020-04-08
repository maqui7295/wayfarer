const Validator = require('validatorjs');

const isValid = (data, rules) => {
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return {
      errors: validation.errors,
      is_valid: false
    };
  }
  return {
    data,
    is_valid: true
  };
};

// validator function
const isSignUpRequestValid = (data) => {
  const rules = {
    email: 'required|email',
    first_name: 'required',
    last_name: 'required',
    password: 'required'
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

const isCreateTripRequestValid = (data) => {
  const rules = {
    token: 'required',
    is_admin: 'required',
    user_id: 'required'
  };
  return isValid(data, rules);
};

module.exports = {
  isSignUpRequestValid,
  isSignInRequestValid,
  isCreateTripRequestValid
};
