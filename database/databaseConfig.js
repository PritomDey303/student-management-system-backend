const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const databaseConnectionConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

//create connection
const connection = mysql.createConnection(databaseConnectionConfig);

module.exports = connection;
