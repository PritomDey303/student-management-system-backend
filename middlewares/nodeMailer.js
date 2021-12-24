const nodemailer = require("nodemailer");

async function sendVerificationMail(req, res, next) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const options = {
      from: "sstudentinfo@gmail.com",
      to: req.email,
      subject: req.subject,
      html: req.html,
    };
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err.message);
        console.log(err.message);
        res.json({
          status: 500,
          msg: "Sorry! something went wrong.",
        });
      } else {
        console.log(info.response);

        res.json({
          status: 200,
          msg: "Verification mail is being sent to your email. Verify your email.",
        });
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Sorry! something went wrong.",
    });
  }
}

async function sendMail(email, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const options = {
      from: "sstudentinfo@gmail.com",
      to: email,
      subject: subject,

      html: html,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}
module.exports = { sendVerificationMail, sendMail };
