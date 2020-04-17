const Router = require('express-promise-router');

const bookingController = require('../controllers/bookingController')();

const {
  checkToken,
  verifyToken
} = require('../middlewares/routeMiddlewares');

const {
  isCreateBookingRequestValid,
  isBookingRequestValid,
  isChangeSeatRequestValid
} = require('../validators/bookingsValidators');

const {
  checkOutcome
} = require('../validators/responses');

const router = Router();

// validate the token and make sure other params are present
const validateTripReq = (req, res, next) => {
  let outcome;
  switch (req.method) {
    case 'GET':
      outcome = isBookingRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    case 'POST':
      outcome = isCreateBookingRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    case 'DELETE':
      outcome = isBookingRequestValid(req.body);
      break;
    case 'PATCH':
      outcome = isChangeSeatRequestValid(req.body);
      break;
    default:
      break;
  }
  next();
};

router.use('/bookings', [checkToken, verifyToken, validateTripReq]);
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.delete('/bookings/:bookingId', bookingController.deleteBooking);
router.patch('/bookings/:bookingId', bookingController.changeSeats);

module.exports = router;