const Router = require('express-promise-router');

const tripController = require('../controllers/tripController')();
const { checkToken, verifyToken, isAdmin } = require('../middlewares/route_middlewares');

const {
  isCreateTripRequestValid,
  isTripRequestValid
} = require('../validators/trip_validators');

const { checkOutcome } = require('../validators/responses');

const router = Router();

// validate the token and make sure other params are present
const validateTripReq = (req, res, next) => {
  let outcome;
  switch (req.method) {
    case 'GET':
      outcome = isTripRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    case 'POST':
      outcome = isCreateTripRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    default:
      break;
  }
  next();
};

router.use('/trips', [checkToken, validateTripReq, verifyToken]);
router.post('/trips', isAdmin, tripController.createTrip);
router.get('/trips', tripController.getTrips);

module.exports = router;
