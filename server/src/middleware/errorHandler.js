const errorHandler = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      message: "The requested resource was not found.",
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }
    return res.status(400).json({
      success: false,
      message: "Please check your input and try again.",
      fields,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Session invalid. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "Something went wrong on our end. Please try again later."
      : err.message || "Something went wrong. Please try again.";

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
