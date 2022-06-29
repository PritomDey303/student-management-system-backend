const mysql = require("mysql");

const databaseConnectionConfig = {
  host: "sql11.freemysqlhosting.net",
  user: "sql11502883",
  port: 3306,
  password: "BCXSbXGNsr",
  database: "sql11502883",
};

//create connection
const connection = mysql.createConnection(databaseConnectionConfig);

module.exports = connection;
