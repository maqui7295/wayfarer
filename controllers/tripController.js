const tripRepository = require('../repositories/tripRepository');

const {
  // eslint-disable-next-line no-unused-vars
  errorResponse,
  // eslint-disable-next-line no-unused-vars
  successResponse
} = require('../validators/responses');

function tripController() {
  async function createTrip(req, res) {
    try {
      const result = await tripRepository.createTrip(req.body);
      successResponse(res, result, 201);
    } catch (error) {
      errorResponse(res, error.message, 400);
    }
  }

  async function getTrips(req, res) {
    try {
      const result = await tripRepository.all();
      successResponse(res, result, 200);
    } catch (error) {
      errorResponse(res, error.message, 400);
    }
  }

  return ({
    createTrip,
    getTrips
  });
}

module.exports = tripController;