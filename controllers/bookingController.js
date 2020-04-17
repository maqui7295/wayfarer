const bookingRepository = require('../repositories/bookingRepository');
const userRepository = require('../repositories/userRepository');
const {
  errorResponse
} = require('../validators/responses');

// The user sees number of seats
// the user sees number of available seats
// add a seat_number column to bookings table.
// in order to book a seats the user shall see the bus, the capacity and available seats.
function bookingController() {
  const makeResponseData = (booking, user) => {
    const data = {
      ...booking,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };
    return data;
  };
  async function createBooking(req, res) {
    try {
      const booking = await bookingRepository.bookAseat(req.body);
      if (!booking) {
        return res.status(422).json({
          status: 'error',
          error: 'The trip is either cancelled or the seat you chose seat has been taken'
        });
      }
      const user = await userRepository.findById(+req.body.user_id);
      res.status(201);
      const data = makeResponseData(booking, user);
      return res.json({
        status: 'success',
        data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  }

  async function getBookings(req, res) {
    try {
      let bookings;
      const user = await userRepository.findById(+req.body.user_id);
      if (user.is_admin) {
        bookings = await bookingRepository.all();
      } else {
        bookings = await bookingRepository.findByField('user_id', user.id);
      }
      const data = bookings.map(booking => makeResponseData(booking, user));
      return res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  }

  async function deleteBooking(req, res) {
    try {
      const booking = await bookingRepository.findById(+req.params.bookingId);
      if (!booking) {
        return res.sendStatus(404);
      }
      if (+req.body.user_id === +booking.user_id) {
        await bookingRepository.deleteById(+req.params.bookingId);
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Booking deleted successfully'
          }
        });
      }
      return res.sendStatus(403);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  }

  async function changeSeats(req, res) {
    try {
      // check if the user is authorized to change seats
      let booking = await bookingRepository.findById(+req.params.bookingId);
      if (+req.body.user_id !== booking.user_id) {
        return res.status(403).json({
          status: 'error',
          error: 'Please you cannot change another"s seat!'
        });
      }
      booking = await bookingRepository.changeSeat(+req.params.bookingId, req.body);
      if (!booking) {
        return res.status(422).json({
          status: 'error',
          error: 'The trip is either cancelled or the new seat you chose is not available'
        });
      }
      res.status(201);
      return res.json({
        status: 'success',
        data: {
          message: 'Seat changed successfully'
        }
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  }

  return Object.freeze({
    createBooking,
    getBookings,
    deleteBooking,
    changeSeats
  });
}

module.exports = bookingController;