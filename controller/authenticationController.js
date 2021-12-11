const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const connection = require("../database/databaseConfig");

//login controller
async function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    //query
    const user = `SELECT * FROM students WHERE email='${email}'`;

    connection.query(user, (err, result) => {
      if (result.length) {
        bcrypt.compare(
          password,
          result[0].password,
          function (err, isValidPassword) {
            if (isValidPassword) {
              const userObj = {
                student_id: result[0].student_id,
                email: result[0].email,
                role: result[0].role,
              };
              //generate token
              const token = jwt.sign(userObj, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRY,
              });

              //set cookie
              res.cookie(process.env.COOKIE_NAME, token, {
                maxAge: process.env.JWT_EXPIRY,
                httpOnly: true,
                signed: true,
              });
              //
              res.locals.loggedInUser = userObj;
              res.send(userObj);
            } else {
              res.status(500).send("Email or password doesnot match.");
            }
          }
        );
      } else {
        res.status(500).send("Email or password doesnot match.");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

//logout controller
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).send("Logout successful!");
}
module.exports = { login, logout };
