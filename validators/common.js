const Validator = require('validatorjs');

const isValid = (data, rules, customMessages = {}) => {
  const validation = new Validator(data, rules, customMessages);
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