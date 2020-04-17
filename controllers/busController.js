const busRepository = require('../repositories/busRepository');


function authController() {
  async function createBus(req, res) {
    try {
      const outcome = await busRepository.create(req.body);
      res.status(201);
      return res.json({
        status: 'success',
        data: outcome
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: error.message
      });
    }
  }

  async function getBuses(req, res) {
    try {
      const outcome = await busRepository.all();
      res.status(200);
      return res.json({
        status: 'success',
        data: outcome
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: error.message
      });
    }
  }

  async function deleteBus(req, res) {
    try {
      await busRepository.deleteById(+req.params.busId);
      res.status(200);
      return res.json({
        status: 'success',
        data: {
          message: 'Bus deleted successfully'
        }
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: error.message
      });
    }
  }

  return Object.freeze({
    createBus,
    getBuses,
    deleteBus
  });
}

module.exports = authController;