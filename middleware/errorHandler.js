const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statuscode = res.statuscode ? res.statusCode : 500;
  switch (statuscode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.UNAUTHORIZED:
      res.status(statuscode).json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.FORBIDDEN:
      res.status(statuscode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.SEREVER_ERROR:
      res.status(statuscode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      console.log("No Error, All good!");
      break;
  }
};

module.exports = errorHandler;
