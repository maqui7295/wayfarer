const { Pool } = require('pg');

// const {
//   DB,
//   DB_NAME,
//   DB_USER,
//   DB_PASSWORD,
//   DB_HOST,
//   DB_PORT
// } = require('./environment');

const connectionString = 'postgresql://postgres:92Axq@qwZU$werqklcme212@localhost:5432/wayfarer';
// const connectionString = `${DB}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const pool = new Pool({ connectionString });


module.exports = pool;
