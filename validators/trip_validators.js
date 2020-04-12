const isValid = require('./common');

const commonRules = {
  token: 'required|string',
  is_admin: 'required|boolean',
  user_id: 'required|numeric',
};

const customMessages = {
  'required.is_admin': 'The is_admin field is required.',
  'required.user_id': 'The user_id field is required.',
};

const isCreateTripRequestValid = (data) => {
  const rules = {
    ...commonRules,
    bus_id: 'required|numeric',
    origin: 'required|string',
    destination: 'required|string',
    trip_date: 'required|date',
    fare: 'required|numeric'
  };
  return isValid(data, rules, customMessages);
};


const isTripRequestValid = (data) => {
  const rules = {
    ...commonRules
  };
  return isValid(data, rules, customMessages);
};

module.exports = {
  isCreateTripRequestValid,
  isTripRequestValid
};