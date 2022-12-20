import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.protocol}://${req.ip}${req.originalUrl}\t${req.headers.host}\t${req.headers["user-agent"]}`,
    "reqLog.log"
  );

  const dateTime = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;

  console.log(
    `${dateTime}\t${req.method}\t${req.protocol}://${req.ip}${req.originalUrl}\t${req.headers.host}\t${req.res.statusCode}`
  );

  next();
};
