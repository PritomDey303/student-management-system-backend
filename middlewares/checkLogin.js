const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookies) {
    try {
      token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
      next(err.message);
    }
  } else {
    next("Sorry! Something went wrong.");
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
