const express = require("express");
const app = express();
const dotenv = require("dotenv");

//routes
const authenticationRoute = require("./routes/authenticationRoute");
const signUpRoute = require("./routes/signUpRoute");
const academicInfoRoute = require("./routes/academicInfoRoute");
const studentsRoute = require("./routes/studentsRoute");
const adminRoute = require("./routes/adminRoute");
const personalInfoRoute = require("./routes/personalInfoRoute");
const educationInfoRoute = require("./routes/educationInfoRoute");
const resultRoute = require("./routes/resultRoute");
//cookie parser
const cookieParser = require("cookie-parser");

//importing middlewares
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { errorHandler } = require("./middlewares/errorHandler");
const connection = require("./database/databaseConfig");
//port
//database config
connection.connect((err) => {
  if (err) {
    console.log("connection failed.aaaa");
  } else {
    console.log("connection successful!");
  }
});

//cors
app.use(
  cors({
    origin: process.env.CLIENT_SITE_DOMAIN,
    methods: ["GET", "POST", " DELETE", "UPDATE", "PUT", " PATCH"],
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
app.use("/personalinfo", personalInfoRoute);
app.use("/educationinfo", educationInfoRoute);
app.use("/result", resultRoute);

//errorHandler
app.use(errorHandler);
app.listen(process.env.PORT || 5000);
