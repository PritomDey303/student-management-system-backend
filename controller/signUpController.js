const express = require("express");
const connection = require("../database/databaseConfig");
const bcrypt = require("bcrypt");
async function studentSignUp(req, res, next) {
  const imgurl = req.imgurl;
  const { student_id, name, email, session, hall, semester, password } =
    req.body;
  let hashedPassword = bcrypt.hashSync(password, 5);
  let authentication_id =
    Math.floor(1000000000000 + Math.random() * Date.now()) +
    name.split(" ").join("");
  try {
    //verifying if email and student id is already exist or not
    const searchUser = `SELECT * FROM authentication WHERE  email='${email}'`;
    connection.query(searchUser, (err, result1) => {
      result1 = result1.length;
      if (err) {
        res.status(500).send(err.message);
      } else {
        if (!result1) {
          const searchStudent = `SELECT * FROM students WHERE student_id=${student_id}`;
          connection.query(searchStudent, (err, result2) => {
            if (err) {
              next(err.message);
            } else {
              if (!result2.length) {
                const insertAuth = `INSERT INTO authentication(authentication_id,email, password, role) VALUES ('${authentication_id}','${email}','${hashedPassword}',2)
          `;
                connection.query(insertAuth, (err, result3) => {
                  if (err) {
                    res.status(500).send(err.message);
                  } else {
                    console.log("come");
                    const studentInsertQuery = `INSERT INTO students(student_id, name, session,hall,  currentSemester,status,id_img,authentication) VALUES (${student_id},'${name}','${session}',${hall},${semester},'Pending','${imgurl}','${authentication_id}')`;
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
                  }
                });
              } else {
                res.status(500).send("User already exists.");
              }
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
/////////////////////////////////////////////////////
////////////////////////////////////////////////
//admin signup
////////////////////////////////////////////////////
//////////////////////////////////////////////////
async function adminSignUp(req, res, next) {
  const { name, email, password } = req.body;
  let hashedPassword = bcrypt.hashSync(password, 5);
  let authentication_id =
    Math.floor(1000000000000 + Math.random() * Date.now()) +
    name.split(" ").join("");
  try {
    //verifying if email and student id is already exist or not
    const searchAdmin = `SELECT * FROM authentication WHERE  email='${email}'`;
    connection.query(searchAdmin, (err, result1) => {
      resultant = result1.length;
      if (err) {
        next(err.message);
      } else {
        if (!resultant) {
          const authQuery = `INSERT INTO authentication(authentication_id,email, password, role) VALUES ('${authentication_id}','${email}','${hashedPassword}',1)
          `;
          connection.query(authQuery, (err, result2) => {
            if (err) {
              next(err.message);
            } else {
              const adminInsertQuery = `INSERT INTO admin(admin_name,  authentication) VALUES ('${name}','${authentication_id}')`;
              connection.query(adminInsertQuery, (err, result2) => {
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
            }
          });
        } else {
          res
            .status(500)
            .send(
              "This email is  already exists. Please try with another email ."
            );
        }
      }
    });
  } catch (err) {
    next("Sorry! Something went wrong.");
  }
}

module.exports = { studentSignUp, adminSignUp };
