function tripController() {
  function createTrip(req, res) {
    return res.send('creating trips');
  }

  function getTrips(req, res) {
    return res.send('getting all trips');
  }

  return {
    createTrip,
    getTrips
  };
}

module.exports = tripController;