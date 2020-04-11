const { Pool } = require('pg');

const {
  DB,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = require('./environment');

// const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
const connectionString = `${DB}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const pool = new Pool({ connectionString });

module.exports = pool;
