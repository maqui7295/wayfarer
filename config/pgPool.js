const {
  Pool
} = require('pg');


// let dbName = 'wayfarer';

// // during testing, comment out in production
// dbName = 'testdb';


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString
});


module.exports = pool;