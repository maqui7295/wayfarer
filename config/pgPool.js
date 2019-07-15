const { Pool } = require('pg');

const connectionString = 'postgresql://postgres:92Axq@qwZU$werqklcme212@localhost:5432/wayfarer';
// const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'

const pool = new Pool({ connectionString });

// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res);
//     pool.end();
// });
module.exports = pool;
