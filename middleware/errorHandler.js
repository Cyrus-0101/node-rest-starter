import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\n`,
    "errorLog.log"
  );

  console.error(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({
    status: "error",
    message: err.message,
  });
};

export default errorHandler;
