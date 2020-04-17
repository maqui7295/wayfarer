const Router = require('express-promise-router');

const busController = require('../controllers/busController')();

const {
  checkToken,
  verifyToken,
  isAdmin
} = require('../middlewares/routeMiddlewares');

const {
  isCreateBusRequestValid,
  isGetBusesRequestValid,
  isDeleteBusRequestValid
} = require('../validators/busValidators');

const {
  checkOutcome
} = require('../validators/responses');

const router = Router();

// validate the token and make sure other params are present
const validateTripReq = (req, res, next) => {
  let outcome;
  switch (req.method) {
    case 'GET':
      outcome = isGetBusesRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    case 'POST':
      outcome = isCreateBusRequestValid(req.body);
      checkOutcome(outcome, res);
      break;
    case 'DELETE':
      outcome = isDeleteBusRequestValid(req.body);
      break;
    default:
      break;
  }
  next();
};

router.use('/bus', [checkToken, validateTripReq, verifyToken]);
router.post('/bus', isAdmin, busController.createBus);
router.get('/bus', busController.getBuses);
router.delete('/bus/:busId', isAdmin, busController.deleteBus);

module.exports = router;