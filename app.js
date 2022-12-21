import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import { logger, logEvents } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import corsOptions from "./config/corsOptions.js";
import dbConn from "./config/dbConn.js";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Getting the current file path in ES6
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dbConn();

app.use(logger);

app.use(express.json());

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: `API is running on port ${PORT}`,
  });
});

app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "views", "404.html"));
    return;
  } else if (req.accepts("json")) {
    res.json({
      status: "error",
      message: "404 Not found",
    });
    return;
  } else {
    res.type("txt").send("404 Not found");
    return;
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.info(
    `MongoDB connection error. Please make sure MongoDB is running. ${err}`
  );
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
