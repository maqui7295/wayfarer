const isValid = require('./common');

const commonRules = {
  user_id: 'required|numeric',
  trip_id: 'required|numeric'
};

const isCreateBookingRequestValid = (data) => {
  const rules = {
    ...commonRules,
    seat_number: 'required|numeric'
  };
  return isValid(data, rules);
};

const isBookingRequestValid = data => isValid(data, commonRules);

const isChangeSeatRequestValid = (data) => {
  const rules = {
    ...commonRules,
    bus_id: 'required|numeric',
    old_seat_number: 'required|numeric',
    new_seat_number: 'required|numeric'
  };
  return isValid(data, rules);
};

module.exports = {
  isCreateBookingRequestValid,
  isBookingRequestValid,
  isChangeSeatRequestValid
};