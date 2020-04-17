const request = require('supertest');

const app = require('../../index');
const bookingRepository = require('../../repositories/bookingRepository');
const tripRepository = require('../../repositories/tripRepository');

const agent = request.agent(app);


describe('Trips and Booking integration tests', () => {
  let user;

  const userPost = {
    email: 'user@gmail.com',
    password: '12345678'
  };
  beforeEach(async () => {
    const result = await agent
      .post('/api/v1/auth/signin')
      .send(userPost)
      .expect(200);

    user = result.body;
  });

  it('should return a logged in user', () => {
    expect(user.auth).toBe(true);
  });

  it('should allow the user to view trips but not create one if the user is not an admin', async () => {
    const authorization = `Bearer ${user.token}`;

    const data = {
      user_id: user.user_id,
      bus_id: 1
    };

    const result = await agent
      .get('/api/v1/trips')
      .set('Accept', 'application/json')
      .set('authorization', authorization)
      .send(data)
      .expect(200);

    expect(result.body.status).toBe('success');
    expect(result.body.data[0].bus_id).toBe(1);
  });

  it('should allow the user to book a trip and view the returned the booked trip', async () => {
    const authorization = `Bearer ${user.token}`;

    const data = {
      user_id: user.user_id,
      bus_id: 1,
      trip_id: 1,
      seat_number: 1
    };

    const result = await agent
      .post('/api/v1/bookings')
      .set('Accept', 'application/json')
      .set('authorization', authorization)
      .send(data)
      .expect(201);

    expect(result.body.status).toBe('success');

    const booking = result.body.data;

    expect(booking.email).toBe(userPost.email);
    expect(booking.bus_id).toBe(data.bus_id);

    let isSeatTaken = await tripRepository.isSeatTaken(data.trip_id, booking.seat_number);

    expect(isSeatTaken).toBe(true);

    expect(await tripRepository.isTripOrBusFilled(data.bus_id, data.trip_id)).toBe(false);

    await bookingRepository.deleteById(booking.id);

    const seats = await tripRepository.getSeats(data.trip_id);

    const updSeats = await tripRepository.updateSeats(seats, {
      seat_number: booking.seat_number,
      taken: false
    });
    const trip = await tripRepository.update({
      id: data.trip_id
    }, {
      seats: updSeats
    });

    isSeatTaken = await tripRepository.isSeatTaken(trip.id, booking.seat_number);

    expect(isSeatTaken).toBe(false);
  });

  it('should allow a user to change seat', async () => {

    const authorization = `Bearer ${user.token}`;

    const data = {
      user_id: user.user_id,
      bus_id: 1,
      trip_id: 1,
      seat_number: 1
    };

    // user books a seat
    const result = await agent
      .post('/api/v1/bookings')
      .set('Accept', 'application/json')
      .set('authorization', authorization)
      .send(data)
      .expect(201);

    expect(result.body.status).toBe('success');

    const booking = result.body.data;

    expect(booking.seat_number).toBe(1);
    expect(booking.user_id).toBe(data.user_id);

    let isSeatTaken = await tripRepository.isSeatTaken(data.trip_id, booking.seat_number);
    expect(isSeatTaken).toBe(true);

    const newData = {
      ...data,
      old_seat_number: data.seat_number,
      new_seat_number: 2
    };

    const newResult = await agent
      .patch(`/api/v1/bookings/${booking.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authorization)
      .send(newData)
      .expect(201);

    expect(newResult.body.status).toBe('success');
    expect(newResult.body.data.message).toBe('Seat changed successfully');

    isSeatTaken = await tripRepository.isSeatTaken(data.trip_id, booking.seat_number);
    expect(isSeatTaken).toBe(false);

    expect(await tripRepository.isSeatTaken(data.trip_id, newData.new_seat_number)).toBe(true);

    // clean up
    const seats = await tripRepository.getSeats(data.trip_id);
    const updSeats = await tripRepository.updateSeats(seats, {
      seat_number: newData.new_seat_number,
      taken: false
    });
    await tripRepository.update({
      id: data.trip_id
    }, {
      seats: updSeats
    });
    expect(await tripRepository.isSeatTaken(data.trip_id, newData.new_seat_number)).toBe(false);
    await bookingRepository.deleteById(booking.id);
  });
});