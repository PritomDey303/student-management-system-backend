const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../database/databaseConfig");

//login controller
async function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  console.log("email");

  try {
    //query
    const user = `SELECT * FROM authentication WHERE email='${email}'`;
    connection.query(user, (err, result) => {
      if (result.length) {
        if (result[0].status === "Approved") {
          bcrypt.compare(
            password,
            result[0].password,
            function (err, isValidPassword) {
              if (isValidPassword) {
                const userObj = {
                  authentication_id: result[0].authentication_id,
                  email: result[0].email,
                  role: result[0].role,
                };
                //generate token
                const token = jwt.sign(userObj, process.env.JWT_SECRET, {
                  expiresIn: "2h",
                });

                //set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                  maxAge: process.env.COOKIE_EXPIRY,
                  httpOnly: true,
                  signed: true,
                  secure: true,
                  sameSite: Strict,
                });
                //
                res.status(200).json(userObj);
              } else {
                res.json({ msg: "Invalid email or password." });
              }
            }
          );
        } else {
          res.json({
            status: 500,
            msg: "Your account is not verified yet.",
          });
        }
      } else {
        res.json({ msg: "Invalid email or password." });
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}

/////////////////////////
//keep login function
///////////////////////
async function keepLogin(req, res, next) {
  try {
    if (req.user.email) {
      res.status(200).send(req.user);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.json({ msg: err.message });
  }
}
//logout controller
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).send("Logout successful!");
}
module.exports = { login, logout, keepLogin };
