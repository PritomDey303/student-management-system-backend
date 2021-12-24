const connection = require("../database/databaseConfig");
const { sendMail } = require("../middlewares/nodeMailer");

async function allStudents(req, res, next) {
  try {
    if (req.user.role === 2) {
      const students = `SELECT * FROM students 
      JOIN personalinfo ON students.student_id=personalinfo.student
      JOIN educationinfo ON students.student_id=educationinfo.student`;
      connection.query(students, (err, result) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//get logged in student
async function loggedInStudent(req, res, next) {
  console.log(req.user);
  try {
    if (req.user.role === 1) {
      const students = `SELECT * FROM students 
      JOIN personalinfo ON students.student_id=personalinfo.student
      JOIN educationinfo ON students.student_id=educationinfo.student`;
      connection.query(student, (err, result) => {
        if (err) {
          res.status(500).send("Sorry! Something went wrong.");
        } else {
          res.status(200).send(result);
        }
      });
    } else {
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
      const student = `SELECT * FROM students WHERE student_id=${req.params.id}`;
      connection.query(student, (err, result) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      res.status(500).send("You are not allowed to visit").redirect("/");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//filtered students

async function filteredstudents(req, res, next) {
  const student_id = req.body.student_id;
  const name = req.body.name;
  const session = req.body.session;
  const semester = req.body.semester;
  console.log(student_id, name, session, semester);

  try {
    if (req.user.role === 1) {
      let students = `SELECT * FROM students JOIN personalinfo ON students.student_id=personalinfo.student JOIN educationinfo ON students.student_id=educationinfo.student`;
      if (
        name !== undefined ||
        student_id !== undefined ||
        session !== undefined ||
        semester !== undefined
      ) {
        students += " WHERE";
      }
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
          students += " AND session = " + `${session}`;
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
      console.log(students);
      connection.query(students, (err, result) => {
        if (err) {
          console.log("here");
          res.status(500).send(err.message);
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}
/////////////////////
//get pending students
async function getPendingStudents(req, res, next) {
  try {
    const pendingstudents = ` SELECT * FROM authentication  JOIN students ON students.authentication=authentication.authentication_id WHERE role=1 AND status="Pending"`;

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
          const declineStudent = `DELETE authentication,students  FROM authentication
  INNER JOIN students  ON authentication.authentication_id=students.authentication
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
