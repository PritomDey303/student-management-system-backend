const express = require("express");
const connection = require("../database/databaseConfig");
const bcrypt = require("bcrypt");
async function studentSignUp(req, res, next) {
  const imgurl = req.imgurl;
  const { student_id, name, email, session, hall, semester, password } =
    req.body;
  let hashedPassword = bcrypt.hashSync(password, 5);

  try {
    //verifying if email and student id is already exist or not
    const searchStudent = `SELECT * FROM students WHERE student_id=${student_id} or email='${email}'`;
    connection.query(searchStudent, (err, result1) => {
      console.log(result1.length);
      result1 = result1.length;
      if (err) {
        res.status(500).send(err.message);
      } else {
        if (!result1) {
          const studentInsertQuery = `INSERT INTO students(student_id, name, session,hall, role, currentSemester, email, password,status,id_img) VALUES (${student_id},'${name}','${session}',${hall},1,${semester},'${email}','${hashedPassword}','Pending','${imgurl}')`;
          connection.query(studentInsertQuery, (err, result2) => {
            if (err) {
              res.status(500).send(err.message);
            } else {
              res
                .status(200)
                .send(
                  "Congrats! Sign up successful.Please wait for verification. You will be notified by mail if your account is verified."
                );
            }
          });
        } else {
          res
            .status(500)
            .send(
              "This email or Student Id number already exists. Please try with another email or Student Id number."
            );
        }
      }
    });
  } catch (err) {
    res.status(500).send("Sorry! Something went wrong2.");
  }
}

module.exports = { studentSignUp };
