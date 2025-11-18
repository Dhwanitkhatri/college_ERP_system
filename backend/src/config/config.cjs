const path = require('path');
require('dotenv').config({ path: path.resolve('.env') }); // adjust path relative to config.cjs
console.log(process.env.DB_USER);
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306
  }
};
