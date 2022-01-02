const connection = require("../database/databaseConfig");
const { sendMail } = require("../middlewares/nodeMailer");

async function allStudents(req, res, next) {
  try {
    if (req.user.role === 1) {
      const students = `SELECT * FROM students 
      JOIN personalinfo ON students.student_id=personalinfo.student
      JOIN educationinfo ON students.student_id=educationinfo.student JOIN hall ON students.hall=hall.hall_id JOIN semester ON semester.semester_id=students.currentSemester ORDER BY student_id DESC`;
      connection.query(students, (err, result) => {
        if (err) {
          res.json({
            status: 500,
            msg: err.message,
          });
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.json({
      status: 500,
      msg: err.message,
    });
  }
}

//get logged in student
async function loggedInStudent(req, res, next) {
  console.log(req.user);
  try {
    if (req.user.role === 2) {
      const student = `SELECT *,authentication.email FROM students
      JOIN educationinfo ON educationinfo.student=students.student_id
      JOIN personalinfo ON  personalinfo.student=students.student_id
      JOIN hall ON hall.hall_id=students.hall 
      JOIN semester ON  semester.semester_id=students.currentSemester
      JOIN authentication ON authentication.authentication_id=students.authentication
       WHERE students.authentication='${req.user.authentication_id}'`;
      connection.query(student, (err, result) => {
        if (err) {
          console.log(err.message);

          res.json({
            status: 500,
            msg: err.message,
          });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      });
    } else {
      console.log("here2");
      res.status(500).send("Sorry! Something went wrong!").redirect("/");
    }
  } catch (err) {
    res.status(500).send("Sorry! Something went wrong.");
  }
}

//get single student based on id
async function singleStudentById(req, res, next) {
  try {
    if (req.user.role === 1) {
      const student = `SELECT *,authentication.email FROM students
      JOIN educationinfo ON educationinfo.student=students.student_id
      JOIN personalinfo ON  personalinfo.student=students.student_id
      JOIN hall ON hall.hall_id=students.hall 
      JOIN semester ON  semester.semester_id=students.currentSemester
      JOIN authentication ON authentication.authentication_id=students.authentication
       WHERE student_id=${req.params.id}`;
      connection.query(student, (err, result) => {
        if (err) {
          res.json({
            status: 500,
            msg: err.message,
          });
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      res
        .json({
          status: 500,
          msg: "You are not allowed to visit this route.",
        })
        .redirect("/");
    }
  } catch (err) {
    res.json({
      status: 500,
      msg: err.message,
    });
  }
}

//filtered students

async function filteredstudents(req, res, next) {
  const student_id =
    req.query.student_id === "" ? undefined : req.query.student_id;
  const name = req.query.name === "" ? undefined : req.query.name;
  const session = req.query.session === "" ? undefined : req.query.session;
  const semester =
    req.query.current_semester === "" ? undefined : req.query.current_semester;

  try {
    if (req.user.role === 1) {
      let students = `SELECT * FROM students JOIN personalinfo ON students.student_id=personalinfo.student JOIN educationinfo ON students.student_id=educationinfo.student JOIN semester ON semester.semester_id=students.currentSemester JOIN hall ON hall.hall_id=students.hall`;
      if (
        name !== undefined ||
        student_id !== undefined ||
        session !== undefined ||
        semester !== undefined
      ) {
        students += " WHERE";

        if (name != undefined) {
          students += ` name LIKE  '%${name}%'`;
        }
        if (student_id !== undefined) {
          if (name) {
            students += ` AND student_id =
           ${parseInt(student_id)} `;
          } else {
            students += ` student_id =
           ${parseInt(student_id)} `;
          }
        }
        if (session !== undefined) {
          if (name || student_id) {
            students += ` AND session='${session}'`;
          } else {
            students += ` session='${session}'`;
          }
        }
        if (semester !== undefined) {
          if (name || student_id || session) {
            students += " AND currentSemester= " + parseInt(semester);
          } else {
            students += " currentSemester= " + parseInt(semester);
          }
        }
        students += " ORDER BY student_id ASC";
        connection.query(students, (err, result) => {
          if (err) {
            res.json({
              status: 500,
              msg: err.message,
            });
          } else {
            res.json({
              status: 200,
              data: result,
            });
          }
        });
      } else {
        res.json({
          status: 500,
          msg: "No student found.",
        });
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      msg: err.message,
    });
  }
}
/////////////////////
//get pending students
async function getPendingStudents(req, res, next) {
  try {
    const pendingstudents = ` SELECT * FROM authentication  JOIN students ON students.authentication=authentication.authentication_id 
    JOIN hall ON hall.hall_id=students.hall 
    JOIN semester on semester.semester_id=students.currentSemester
    WHERE role=2 AND status="Pending"`;

    connection.query(pendingstudents, (err, result) => {
      if (err) {
        res.json({ status: 500, msg: err.message });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}
////////////////////////
//approve student

async function approveStudent(req, res, next) {
  const { id } = req.params;
  console.log(req.params);
  try {
    const getStudent = `SELECT * FROM authentication WHERE authentication_id='${id}' AND status='Pending'`;
    connection.query(getStudent, (err, result) => {
      console.log(result);
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        if (result.length) {
          const updateStudent = `UPDATE authentication SET status='Approved' WHERE 	authentication_id='${id}'`;
          connection.query(updateStudent, (err, result1) => {
            if (err) {
              res.json({ status: 500, msg: err.message });
            } else {
              sendMail(
                result[0].email,
                "Signup Request Verified.",
                "<h3 style='color:green'>Your signup request has been verified by authority. You can login now.</h3>"
              );
              res.json({
                status: 200,
                msg: "Account is Verified.",
              });
            }
          });
        } else {
          res.json({
            status: 500,
            msg: "No user found.",
          });
        }
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}

//decline student signup request
async function declineStudent(req, res, next) {
  const { id } = req.params;
  try {
    const deletedStudent = `SELECT email FROM authentication WHERE authentication_id='${id}' AND status='Pending'`;

    connection.query(deletedStudent, (err, result1) => {
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        if (result1.length) {
          const declineStudent = `DELETE authentication,students,personalinfo,educationinfo  FROM authentication
               INNER JOIN students  ON authentication.authentication_id=students.authentication
               INNER JOIN personalinfo  ON personalinfo.student=students.student_id
               INNER JOIN educationinfo  ON educationinfo.student=students.student_id
               WHERE authentication.authentication_id='${id}'`;
          connection.query(declineStudent, (err, result2) => {
            if (err) {
              res.json({
                status: 500,
                msg: err.message,
              });
            } else {
              sendMail(
                result1[0].email,
                "Signup Request Rejected.",
                "<h3 style='color:red'>Your signup request has been rejected due to incorrect information. Signup again with correct information.</h3>"
              );
              res.json({
                status: 200,
                msg: "Signup request declined.",
              });
            }
          });
        } else {
          res.json({
            status: 500,
            msg: "No student found.",
          });
        }
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}
module.exports = {
  allStudents,
  loggedInStudent,
  singleStudentById,
  filteredstudents,
  approveStudent,
  declineStudent,
  getPendingStudents,
};
