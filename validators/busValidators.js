const isValid = require('./common');

const commonRules = {
  token: 'required|string',
  is_admin: 'required|boolean',
  user_id: 'required|numeric'
};

const isCreateBusRequestValid = (data) => {
  const rules = {
    ...commonRules,
    number_plate: 'required|string|alpha_dash',
    manufacturer: 'sometimes|string',
    model: 'required|string',
    capacity: 'required|numeric',
  };
  return isValid(data, rules);
};

const isGetBusesRequestValid = (data) => {
  const rules = {
    ...commonRules
  };
  return isValid(data, rules);
};

const isDeleteBusRequestValid = (data) => {
  const rules = {
    ...commonRules
  };
  return isValid(data, rules);
};

module.exports = { isCreateBusRequestValid, isGetBusesRequestValid, isDeleteBusRequestValid };