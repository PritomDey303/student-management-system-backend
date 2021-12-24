const express = require("express");
const dotenv = require("dotenv");
const app = express();
//routes
const authenticationRoute = require("./routes/authenticationRoute");
const signUpRoute = require("./routes/signUpRoute");
const academicInfoRoute = require("./routes/academicInfoRoute");
const studentsRoute = require("./routes/studentsRoute");
const adminRoute = require("./routes/adminRoute");
//cookie parser
const cookieParser = require("cookie-parser");

//importing middlewares
const cors = require("cors");
const fileUpload = require("express-fileupload");
const {
  errorHandler,
  notFoundHandler,
} = require("c:/users/walton/documents/chat-application/middlewares/common/errorhandler");
//port
const port = 5000;

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//dotenv config
dotenv.config();
//file upload
app.use(fileUpload());

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//using cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//database configuration

//all routes
app.use("/authentication", authenticationRoute);
app.use("/signup", signUpRoute);
app.use("/academicinfo", academicInfoRoute);
app.use("/students", studentsRoute);
app.use("/admin", adminRoute);

//not found handler
app.use(notFoundHandler);
//errorHandler
app.use(errorHandler);
app.listen(port);
