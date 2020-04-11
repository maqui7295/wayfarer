// eslint-disable-next-line consistent-return
const checkOutcome = (outcome, res) => {
  if (!outcome.is_valid) {
    // res.status(422);
    return res.status(422).json({
      status: 'error',
      error: outcome.errors
    });
  }
};

const successResponse = (res, data, status) => {
  res.status(status);
  return res.json({
    status: 'success',
    data
  });
};

const errorResponse = (res, message, status) => {
  res.status(status);
  res.json({
    status: 'error',
    error: message
  });
};

module.exports = {
  checkOutcome,
  errorResponse,
  successResponse
};