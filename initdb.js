const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const userRepository = require('./repositories/userRepository');
const busRepository = require('./repositories/busRepository');
const tripRepository = require('./repositories/tripRepository');

const filepath = path.join(__dirname, 'tables.sql');

const readFilePromisified = promisify(fs.readFile);

async function createTables() {
  try {
    const contents = await readFilePromisified(filepath, {
      encoding: 'utf8'
    });
    await userRepository.execute(contents);

    const admin = await userRepository.createUser({
      email: 'admin@gmail.com',
      password: '12345678',
      first_name: 'Johnny',
      last_name: 'Cash',
      is_admin: true
    });

    await userRepository.createUser({
      email: 'user@gmail.com',
      password: '12345678',
      first_name: 'Johnny',
      last_name: 'Cash'
    });

    const bus = await busRepository.create({
      number_plate: 'wer123456',
      manufacturer: 'Toyota',
      model: '24eraz',
      year: '2020',
      capacity: 3
    });

    await tripRepository.create({
      bus_id: bus.id,
      user_id: admin.id,
      origin: 'benin',
      destination: 'lagos',
      trip_date: new Date(),
      fare: 4295.99,
      seats: tripRepository.bus.createSeats(bus.capacity)
    });

    console.log('created and filled the tables with dummy data');
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = createTables();
