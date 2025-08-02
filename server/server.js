const mongoose = require("mongoose");

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED EXCEPTION! Shutting down...");

    process.exit(1);
});

dotenv.config({ path: "./.env" });

const DB = process.env.DB_URL;

mongoose
    .connect(DB)
    .then(() => {
        console.log("DB connection successful!");
    });

const app = require("./app");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on PORT ${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");

    server.close(() => {
        process.exit(1);
    });
});
