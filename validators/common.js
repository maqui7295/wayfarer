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

module.exports = isValid;
