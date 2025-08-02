const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

module.exports = app