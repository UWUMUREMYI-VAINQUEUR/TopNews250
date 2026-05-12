const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,       // e.g. root
  host: process.env.DB_HOST,       // e.g. localhost
  database: process.env.DB_DATABASE,// e.g. tnews
  password: process.env.DB_PASSWORD,// e.g. sv2006
  port: process.env.DB_PORT,       // e.g. 5432
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
