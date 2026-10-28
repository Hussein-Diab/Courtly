const mysql = require('mysql2/promise');
const { db } = require('./env');

module.exports = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.name,
  waitForConnections: true,
  connectionLimit: 10,
});
