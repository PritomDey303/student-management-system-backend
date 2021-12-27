const e = require("express");
const connection = require("../database/databaseConfig");

//update personalinfo

async function updatePersonalInfo(req, res, next) {
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
        if (req.user.role !== 2) {
          res.json({
            status: 500,
            msg: "Invalid user.",
          });
        } else {
          const father_name = req.body.father_name.trim();
          const mother_name = req.body.mother_name.trim();
          const date_of_birth = req.body.date_of_birth.trim();
          const gender = req.body.gender.trim();
          const guardian_name = req.body.guardian_name.trim();
          const guardian_phone = req.body.guardian_phone.trim();
          const nid = req.body.nid.trim();
          const permanent_address = req.body.permanent_address.trim();
          const present_address = req.body.present_address.trim();
          const phone = req.body.phone.trim();
          const religion = req.body.religion.trim();
          try {
            let updateQuery = "UPDATE personalinfo SET ";
            if (father_name !== "") {
              updateQuery += `father_name='${father_name}',`;
            }
            if (mother_name !== "") {
              updateQuery += `mother_name='${mother_name}',`;
            }
            if (date_of_birth !== "") {
              updateQuery += `date_of_birth='${date_of_birth}',`;
            }
            if (guardian_name !== "") {
              updateQuery += `guardian_name='${guardian_name}',`;
            }
            if (guardian_phone !== "") {
              updateQuery += `guardian_phone='${guardian_phone}',`;
            }
            if (gender !== "") {
              updateQuery += `gender='${gender}',`;
            }
            if (nid !== "") {
              updateQuery += `nid='${nid}',`;
            }
            if (present_address !== "") {
              updateQuery += `present_address='${present_address}',`;
            }
            if (permanent_address !== "") {
              updateQuery += `permanent_address='${permanent_address}',`;
            }
            if (phone !== "") {
              updateQuery += `phone='${phone}',`;
            }
            if (religion !== "") {
              updateQuery += `religion='${religion}',`;
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

//get personal info

async function getPersonalInfo(req, res, next) {
  if (req.user.role === 2) {
    try {
      const studentQuery = `SELECT student_id FROM students WHERE authentication='${req.user.authentication_id}'`;
      connection.query(studentQuery, (err, result1) => {
        if (err) {
          res.json({
            status: 500,
            msg: err.message,
          });
        } else {
          if (result1.length) {
            const personalInfoQuery = `SELECT * FROM personalinfo WHERE student=${result1[0].student_id}`;
            connection.query(personalInfoQuery, (err, result2) => {
              if (err) {
                res.json({
                  status: 500,
                  msg: err.message,
                });
              }
              res.send(result2);
            });
          } else {
            res.json({
              status: 500,
              msg: "Invalid user.",
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
      msg: "Invalid user.",
    });
  }
}
module.exports = {
  updatePersonalInfo,
  getPersonalInfo,
};
