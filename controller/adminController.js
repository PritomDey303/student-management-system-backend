const e = require("express");
const connection = require("../database/databaseConfig");
const { sendMail } = require("../middlewares/nodeMailer");
//pending admins
async function getPendingAdmins(req, res, next) {
  try {
    const pendingAdmin = `SELECT * FROM authentication JOIN admin ON authentication.authentication_id=admin.authentication WHERE role=1 AND status="Pending"`;

    connection.query(pendingAdmin, (err, result) => {
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

//approve admin account
async function approveAdmin(req, res, next) {
  const { id } = req.params;
  console.log(req.params);
  try {
    const getAdmin = `SELECT * FROM authentication WHERE authentication_id='${id}' AND status='Pending'`;
    connection.query(getAdmin, (err, result) => {
      console.log(result);
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        if (result.length) {
          const updateAdmin = `UPDATE authentication SET status='Approved' WHERE 	authentication_id='${id}'`;
          connection.query(updateAdmin, (err, result1) => {
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
            msg: "No Admin found.",
          });
        }
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}

async function declineAdmin(req, res, next) {
  const { id } = req.params;
  try {
    const deletedAdmin = `SELECT email FROM authentication WHERE authentication_id='${id}'`;

    connection.query(deletedAdmin, (err, result1) => {
      if (err) {
        res.json({
          status: 500,
          msg: err.message,
        });
      } else {
        const declineAdmin = `DELETE authentication,admin  FROM authentication
        INNER JOIN admin  ON authentication.authentication_id=admin.authentication
        WHERE authentication.authentication_id='${id}'`;
        connection.query(declineAdmin, (err, result2) => {
          if (err) {
            res.json({
              status: 500,
              msg: err.message,
            });
          } else {
            sendMail(
              result1[0].email,
              "Signup request rejection",
              "<h3 style='color:red'>Your signup request has been rejected due to incorrect information. Signup again with correct information.</h3>"
            );
            res.json({
              status: 200,
              msg: "Admin request declined.",
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
}
module.exports = { getPendingAdmins, approveAdmin, declineAdmin };
