const Router = require('express-promise-router');

const tripController = require('../controllers/tripController')();
const {
  checkToken,
  verifyToken,
  isAdmin
} = require('../middlewares/routeMiddlewares');

const {
  isCreateTripRequestValid,
  isTripRequestValid
} = require('../validators/tripValidators');

const {
  checkOutcome
} = require('../validators/responses');

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
    case 'PATCH':
      outcome = isTripRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    default:
      break;
  }
  next();
};

router.use('/trips', [checkToken, verifyToken, validateTripReq]);
router.post('/trips', isAdmin, tripController.createTrip);
router.get('/trips', tripController.getTrips);
router.patch('/trips/:tripId', isAdmin, tripController.cancelTrip);


module.exports = router;