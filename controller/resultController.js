const connection = require("../database/databaseConfig");

async function updateResult(req, res, next) {
  console.log(req.body);
  if (req.user.role === 1) {
    let successMsg = "";
    const {
      student_id,
      result_1,
      result_2,
      result_3,
      result_4,
      result_5,
      result_6,
      result_7,
      result_8,
      result_9,
      result_10,
    } = req.body;
    const loopArr = [
      {
        key: 1,
        resultant: result_1,
      },
      {
        key: 2,
        resultant: result_2,
      },
      {
        key: 3,
        resultant: result_3,
      },
      {
        key: 4,
        resultant: result_4,
      },
      {
        key: 5,
        resultant: result_5,
      },
      {
        key: 6,
        resultant: result_6,
      },
      {
        key: 7,
        resultant: result_7,
      },
      {
        key: 8,
        resultant: result_8,
      },
      {
        key: 9,
        resultant: result_9,
      },
      {
        key: 10,
        resultant: result_10,
      },
    ];
    try {
      loopArr.map((result) => {
        const { key, resultant } = result;
        if (resultant !== "" && resultant) {
          const selectQuery1 = `SELECT * FROM result WHERE student=${student_id} AND semester=${key}`;

          connection.query(selectQuery1, (err, result1) => {
            if (err) {
              res.json({
                status: 500,
                msg: err.message,
              });
            } else if (result1.length) {
              const updateQuery1 = `UPDATE result SET gpa='${resultant}' WHERE student=${student_id} AND semester=${key}`;
              connection.query(updateQuery1, (err, result12) => {
                if (err) {
                  console.log(err.message + "2");

                  res.json({
                    status: 500,
                    msg: err.message,
                  });
                } else {
                  successMsg += "1st Semester result Updated.";
                }
              });
            } else {
              const insertQuery1 = `INSERT INTO result(gpa,student,semester) VALUES('${resultant}',${student_id},${key})`;
              connection.query(insertQuery1, (err, result12) => {
                if (err) {
                  console.log(err.message + "3");

                  res.json({
                    status: 500,
                    msg: err.message,
                  });
                } else {
                  successMsg += "1st Semester result Updated.";
                }
              });
            }
          });
        }
      });
      res.json({
        status: 200,
        msg: "Result successfully updated.",
      });
    } catch (err) {
      res.json({
        status: 500,
        msg: err.message,
      });
    }
  } else {
    res.json({
      status: 500,
      msg: "Invalid User.",
    });
  }
}

async function getResultById(req, res, next) {
  let { id } = req.params;

  try {
    const selectQuery = `SELECT * FROM result JOIN semester ON semester.semester_id=result.semester WHERE student=${id} ORDER BY semester ASC`;
    connection.query(selectQuery, (err, result) => {
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: err.message,
    });
  }
}

async function getResult(req, res, next) {
  let id = null;
  try {
    console.log(req.user);
    const query = `SELECT student_id from students WHERE authentication='${req.user.authentication_id}'`;
    connection.query(query, (err, result1) => {
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        id = result1[0].student_id;
        const selectQuery = `SELECT * FROM result JOIN semester ON semester.semester_id=result.semester WHERE student=${id} ORDER BY semester ASC`;
        connection.query(selectQuery, (err, result) => {
          if (err) {
            res.json({
              status: 500,
              msg: err.message,
            });
          } else {
            res.send(result);
          }
        });
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: err.message,
    });
  }
}

module.exports = { updateResult, getResultById, getResult };
