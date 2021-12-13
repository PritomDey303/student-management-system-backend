const connection = require("../database/databaseConfig");

async function allStudents(req, res, next) {
  try {
    if (req.user.role === 2) {
      console.log("pritom");
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
async function singleStudent(req, res, next) {
  console.log(req.user);
  try {
    if (req.user.role === 1) {
      const student = `SELECT student_id,email,role FROM students WHERE student_id=${req.user.student_id}`;
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
      res.redirect("/");
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
  const semester = req.body.current_semester;
  console.log(student_id, name, session, semester);

  try {
    if (req.user.role === 1) {
      let students = `SELECT * FROM students `;
      if (
        name !== undefined ||
        student_id !== undefined ||
        session !== undefined ||
        semester !== undefined
      ) {
        students += " WHERE";
      }
      if (name != undefined) {
        students += " name LIKE " + `${connection.escape(name)}`;
      }
      if (student_id !== undefined) {
        students +=
          " AND student_id LIKE " + connection.escape(parseInt(student_id));
      }
      if (session != undefined) {
        students += " AND session = " + `${connection.escape(session)}`;
      }
      if (semester !== undefined) {
        students +=
          " AND currentSemester= " + connection.escape(parseInt(semester));
      }
      console.log(students);
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
module.exports = {
  allStudents,
  singleStudent,
  singleStudentById,
  filteredstudents,
};
