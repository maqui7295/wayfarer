const isValid = require('./common');

const commonRules = {
  token: 'required|string',
  is_admin: 'required',
  user_id: 'required|numeric',
};

const isCreateTripRequestValid = (data) => {
  const rules = {
    ...commonRules,
    bus_id: 'required|numeric',
    origin: 'required|string',
    destination: 'required|string',
    trip_date: 'required',
    fare: 'required|numeric'
  };
  return isValid(data, rules);
};


const isTripRequestValid = (data) => {
  const rules = {
    ...commonRules
  };
  return isValid(data, rules);
};

module.exports = {
  isCreateTripRequestValid,
  isTripRequestValid
};