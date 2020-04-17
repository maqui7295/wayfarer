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
      const {
        query
      } = req;
      let result;
      if (Object.keys(query).length === 0) {
        result = await tripRepository.all();
      } else {
        const {
          origin,
          destination
        } = query;
        if (origin) {
          result = await tripRepository.findByField('origin', origin);
        }
        if (destination) {
          result = await tripRepository.findByField('destination', destination);
        }
        if (origin && destination) {
          result = await tripRepository.findByTwoOrMoreFields({
            origin,
            destination
          });
        }
      }
      successResponse(res, result, 200);
    } catch (error) {
      errorResponse(res, error.message, 400);
    }
  }

  async function cancelTrip(req, res) {
    try {
      // eslint-disable-next-line no-unused-vars
      const result = await tripRepository.update({
        id: +req.params.tripId
      }, {
        status: 0
      });
      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Trip cancelled successfully'
        }
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  }

  return ({
    createTrip,
    getTrips,
    cancelTrip
  });
}

module.exports = tripController;