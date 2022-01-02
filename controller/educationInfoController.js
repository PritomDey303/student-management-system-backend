//get educationinfo

const connection = require("../database/databaseConfig");

async function getEducationInfo(req, res, next) {
  console.log(req.user);
  if (req.user.role === 2) {
    try {
      const selectStudent = `SELECT student_id FROM students WHERE authentication='${req.user.authentication_id}'`;
      connection.query(selectStudent, (err, result1) => {
        if (err) {
          res.json({
            status: 500,
            msg: err.message,
          });
        } else {
          if (result1.length) {
            const educationInfo = `SELECT * FROM educationinfo WHERE student=${result1[0].student_id}`;
            connection.query(educationInfo, (err, result2) => {
              if (err) {
                res.json({
                  status: 500,
                  msg: err.message,
                });
              } else {
                res.send(result2[0]);
              }
            });
          } else {
            res.json({
              status: 500,
              msg: "Invalid User.",
            });
          }
        }
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

//update education info
async function updateEducationInfo(req, res, next) {
  console.log(req.body);
  const selectStudent = `SELECT authentication_id,students.student_id FROM authentication JOIN students ON students.authentication=authentication.authentication_id WHERE authentication_id='${req.body.authentication_id}'`;
  connection.query(selectStudent, (err, result) => {
    if (err) {
      res.json({
        status: 500,
        msg: err.message,
      });
    } else {
      if (result[0].authentication_id === req.user.authentication_id) {
        console.log(req.body);
        if (req.user.role !== 2) {
          res.json({
            status: 500,
            msg: "Invalid user.",
          });
        } else {
          const hsc_year = req.body.hsc_year.trim();
          const hsc_gpa = req.body.hsc_gpa.trim();
          const college = req.body.college.trim();
          const ssc_year = req.body.ssc_year.trim();
          const ssc_gpa = req.body.ssc_gpa.trim();
          const school = req.body.school.trim();

          try {
            let updateQuery = "UPDATE educationinfo SET ";
            if (hsc_year !== "") {
              updateQuery += `hsc_year='${hsc_year}',`;
            }
            if (hsc_gpa !== "") {
              updateQuery += `hsc_gpa='${hsc_gpa}',`;
            }
            if (college !== "") {
              updateQuery += `college='${college}',`;
            }
            if (ssc_gpa !== "") {
              updateQuery += `ssc_gpa='${ssc_gpa}',`;
            }
            if (school !== "") {
              updateQuery += `school='${school}',`;
            }
            if (ssc_year !== "") {
              updateQuery += `ssc_year='${ssc_year}',`;
            }

            const queryLength = updateQuery.length;
            if (updateQuery.charAt(queryLength - 1) === ",") {
              updateQuery = updateQuery.substring(0, queryLength - 1);
            }
            updateQuery += ` WHERE student=${result[0].student_id}`;
            if (updateQuery.includes("SET  WHERE")) {
              res.json({
                status: 500,
                msg: "Nothing to update.",
              });
            } else {
              connection.query(updateQuery, (err, result) => {
                if (err) {
                  res.json({
                    status: 500,
                    msg: err.message,
                  });
                } else {
                  res.json({
                    status: 200,
                    msg: "Info Updated Successfully.",
                  });
                }
              });
            }
          } catch (err) {
            res.json({
              status: 500,
              msg: err.message,
            });
          }
        }
      } else {
        res.json({
          status: 500,
          msg: "Invalid user.",
        });
      }
    }
  });
}
module.exports = {
  getEducationInfo,
  updateEducationInfo,
};
