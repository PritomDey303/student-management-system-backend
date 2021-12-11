const connection = require("../database/databaseConfig");

//geeting halls

async function Halls(req, res) {
  try {
    const halls = "SELECT * FROM `hall`";
    connection.query(halls, (err, result) => {
      if (err) {
        res.send(err.message);
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    res.send(err.message);
  }
}

//getting semesters

async function Semesters(req, res) {
  try {
    const halls = "SELECT * FROM `semester`";
    connection.query(halls, (err, result) => {
      if (err) {
        res.send(err.message);
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    res.send(err.message);
  }
}

//getting sessions
async function Sessions(req, res) {
  try {
    const halls = "SELECT * FROM `session`";
    connection.query(halls, (err, result) => {
      if (err) {
        res.send(err.message);
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    res.send(err.message);
  }
}
module.exports = { Halls, Semesters, Sessions };
