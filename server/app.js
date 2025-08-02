const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require('express-session');

const userRouter = require('./routes/userRoutes')

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Routers
app.use("/api/v1/users", userRouter);

module.exports = app