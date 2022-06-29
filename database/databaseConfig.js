const mysql = require("mysql");

const databaseConnectionConfig = {
  host: "localhost",
  user: "root",
  port: 3307,
  password: "",
  database: "student_management_system",
};

//create connection
const connection = mysql.createConnection(databaseConnectionConfig);

module.exports = connection;
