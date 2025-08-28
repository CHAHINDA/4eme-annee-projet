// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // your PostgreSQL user
  host: 'localhost',          // local DB
  database: 'Marsa',          // the database you restored
  password: '5432',           // your password
  port: 5432                  // default PostgreSQL port
});

module.exports = pool;
