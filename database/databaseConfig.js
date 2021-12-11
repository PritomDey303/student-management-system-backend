const mysql = require("mysql");

const databaseConnectionConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "student_management_system",
};

//create connection
const connection = mysql.createConnection(databaseConnectionConfig);
connection.connect((err) => {
  if (err) {
    console.log("connection failed.");
  } else {
    console.log("connection successful!");
  }
});

module.exports = connection;
