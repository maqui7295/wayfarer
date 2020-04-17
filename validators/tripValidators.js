const isValid = require('./common');

const customMessages = {
  'required.bus_id': 'The bus_id field is required.',
  'required.user_id': 'The user_id field is required.',
};

const isCreateTripRequestValid = (data) => {
  const rules = {
    user_id: 'required|numeric',
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
    user_id: 'required|numeric',
    bus_id: 'required|numeric',
  };
  return isValid(data, rules, customMessages);
};

module.exports = {
  isCreateTripRequestValid,
  isTripRequestValid
};