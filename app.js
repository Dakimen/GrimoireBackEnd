const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const config = require("./config").get(process.env.NODE_ENV);

const UserRoute = require("./api/routes/User");
const BookRoute = require("./api/routes/Book");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose.connect(config.DATABASE);

app.use(methodOverride());
const allowCrossDomain = function (req, res, next) {
  const allowedOrigins = [process.env.FRONT_URL];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, auth-token"
    );
  }

  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

app.use("/images", express.static(path.join(__dirname, "/api/images")));

app.use("/api", [UserRoute, BookRoute]);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
