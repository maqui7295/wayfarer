const Validator = require('validatorjs');

// validator function
const isSignUpRequestValid = (data) => {
  const rules = {
    email: 'required|email',
    first_name: 'required',
    last_name: 'required',
    password: 'required'
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return { errors: validation.errors, is_valid: false };
  }
  return { data, is_valid: true };
};

module.exports = { isSignUpRequestValid };
