const connection = require("../database/databaseConfig");
const bcrypt = require("bcrypt");
const { mailTransporter } = require("./../middlewares/nodeMailer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

async function studentEmailVerificaton(req, res, next) {
  const imgurl = req.imgurl;
  const { student_id, name, email, session, hall, semester, password, role } =
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
        res.json({
          status: 500,
          msg: "Sorry! something went wrong.",
        });
      } else {
        if (!result1) {
          const searchStudent = `SELECT * FROM students WHERE student_id=${student_id}`;
          connection.query(searchStudent, (err, result2) => {
            if (err) {
              res.json({
                status: 500,
                msg: "Sorry! something went wrong.",
              });
            } else {
              if (!result2.length) {
                const userEncryptedData = {
                  authentication_id: authentication_id,
                  email: email,
                  password: hashedPassword,
                  role: 2,
                  student_id: student_id,
                  name: name,
                  session: session,
                  hall: hall,
                  currentSemester: semester,
                  status: "Pending",
                  id_img: imgurl,
                  authentication: authentication_id,
                };
                const token = jwt.sign(
                  userEncryptedData,
                  process.env.JWT_SECRET,
                  {
                    expiresIn: process.env.JWT_EXPIRY,
                  }
                );

                req.token = token;
                req.email = email;
                req.subject = "Email Verification";
                req.html = `<h1>Verify your email and complete signup.</h1>
                <h2><a href='${process.env.CLIENT_SITE_DOMAIN}/verification/${
                  token + role
                }' >Click here to verify</a></h2>`;
                next();
              } else {
                res.json({
                  status: 500,
                  msg: "User already exists.",
                });
              }
            }
          });
        } else {
          res.json({
            status: 500,
            msg: "This email or Student Id number already exists. Please try with another email or Student Id number.",
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Sorry! Something went wrong.",
    });
  }
}

//student signupfinal
async function studentSignUp(req, res, next) {
  const { token } = req.body;

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          console.log(err.message);
          res.json({ status: 500, msg: "Sorry! Something went wrong.jwt" });
        } else {
          const {
            authentication_id,
            email,
            password,
            student_id,
            name,
            role,
            status,
            session,
            hall,
            currentSemester,
            id_img,
          } = data;
          const insertAuth = `INSERT INTO authentication(authentication_id,email, password, role) VALUES ('${authentication_id}','${email}','${password}',${role})
          `;
          connection.query(insertAuth, (err, result3) => {
            if (err) {
              res.json({
                status: 500,
                msg: "Sorry! Something went wrong.",
              });
            } else {
              const studentInsertQuery = `INSERT INTO students(student_id, name, session,hall,  currentSemester,id_img,authentication) VALUES (${student_id},'${name}','${session}',${hall},${currentSemester},'${id_img}','${authentication_id}')`;
              connection.query(studentInsertQuery, (err, result2) => {
                if (err) {
                  res.json({
                    status: 500,
                    msg: "Sorry! Something went wrong.",
                    errMsg: err.message,
                  });
                } else {
                  res.json({
                    status: 200,
                    msg: "Congrats! Sign up successful.Please wait for verification. You will be notified by mail if your account is verified.",
                  });
                }
              });
            }
          });
        }
      });
    } else {
      res.json({
        status: 500,
        msg: "Sorry! Something went wrong.",
        errMsg: err.message,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      msg: "Sorry! Something went wrong.",
      errMsg: err.message,
    });
  }
}

/////////////////////////////////////////////////////
////////////////////////////////////////////////
//admin signup
////////////////////////////////////////////////////
//////////////////////////////////////////////////
async function adminEmailVerification(req, res, next) {
  const { name, email, password, role } = req.body;
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
        res.json({
          status: 500,
          msg: "Sorry! Something went wrong.123",
        });
      } else {
        if (!resultant) {
          const adminData = {
            authentication_id: authentication_id,
            email: email,
            password: hashedPassword,
            role: role,
            name: name,
          };
          const token = jwt.sign(adminData, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
          });

          req.token = token;
          req.email = email;
          req.subject = "Email Verification";
          req.html = `<h1>Verify your email and complete signup.</h1>
          <h2><a href='${process.env.CLIENT_SITE_DOMAIN}/verification/${
            token + role
          }' >Click here to verify</a></h2>`;
          next();
        } else {
          res.json({
            status: 500,
            msg: "The email is already exists.",
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Sorry! Something went wrong.",
    });
  }
}

//////////////////////////////////
async function adminSignUp(req, res, next) {
  console.log("pritom");
  const { token } = req.body;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        console.log(err.message);
        res.json({ status: 500, msg: "Sorry! Something went wrong." });
      } else {
        const { authentication_id, name, email, role, status, password } = data;
        const authQuery = `INSERT INTO authentication(authentication_id,email, password, role) VALUES ('${authentication_id}','${email}','${password}',${role})
        `;
        connection.query(authQuery, (err, result2) => {
          if (err) {
            console.log(err.message);
            res.json({
              status: 500,
              msg: "Sorry! Something went wrong.",
            });
          } else {
            const adminInsertQuery = `INSERT INTO admin(admin_name,  authentication) VALUES ('${name}','${authentication_id}')`;
            connection.query(adminInsertQuery, (err, result2) => {
              if (err) {
                console.log(err.message);
                res.json({
                  status: 500,
                  msg: "Sorry! Something went wrong.",
                });
              } else {
                res.json({
                  status: 200,
                  msg: "Congrats! Sign up successful.Please wait for verification. You will be notified by mail if your account is verified.",
                });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      msg: "Sorry! Something went wrong.",
      errMsg: err.message,
    });
  }
}

module.exports = {
  studentEmailVerificaton,
  studentSignUp,
  adminEmailVerification,
  adminSignUp,
};
