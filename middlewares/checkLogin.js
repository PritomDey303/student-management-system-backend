const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookies) {
    try {
      token = cookies[process.env.COOKIE_NAME];
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
          res.json({ msg: "Invalid User!" });
        } else {
          req.user = data;
        }
      });

      next();
    } catch (err) {
      res.json({ msg: err.message });
    }
  } else {
    res.json({ msg: "Invalid User!" });
  }
};

const redirectLoggedIn = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

module.exports = {
  checkLogin,
  redirectLoggedIn,
};
