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
    const user = `SELECT * FROM authentication WHERE email='${email}'`;
    connection.query(user, (err, result) => {
      if (result.length) {
        bcrypt.compare(
          password,
          result[0].password,
          function (err, isValidPassword) {
            console.log(isValidPassword);
            if (isValidPassword) {
              const userObj = {
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
              res.status(200).json(userObj);
            } else {
              res.status(500).json({ msg: "Sorry! Something went wrong." });
            }
          }
        );
      } else {
        res.status(500).send("Email or password doesnot match.");
      }
    });
  } catch (err) {
    next(err.message);
  }
}

/////////////////////////
//keep login function
///////////////////////
async function keepLogin(req, res, next) {
  try {
    if (req.user.email) {
      return res.status(200).send(req.user);
    } else {
      return res.status(500).send("Sorry! Something went wrong.");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
//logout controller
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).send("Logout successful!");
}
module.exports = { login, logout, keepLogin };
