const AppError = require("../utils/appError");

const sendErrorToDev = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const handleCastError = (res, error) => {
  const message = `Invalid ${error.path} id: ${error.value}. Must be a valid ${
    error.path
  }`;
  return new AppError(message, 400);
};

const handlDuplicate = (res, error) => {
  const message = `Duplicate value found`;
  return new AppError(message, 400);
};

const sendErrorToClient = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("Error occurred in the server:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again later.",
    });
  }
};

module.exports = (error, req, res, next) => {
  console.error(error);

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error!";

  if (process.env.NODE_ENV === "development") {
    sendErrorToDev(res, error);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };

    if (err.name === "CastError") {
      err = handleCastError(res, err); // not working since err doesn't have a name
    }
    if (err.code === 11000) {
      err = handlDuplicate(res, err);
    }
    sendErrorToClient(res, err);
  }
};
