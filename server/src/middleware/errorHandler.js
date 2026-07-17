const errorHandler = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Multer: file too large
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "The image you uploaded is too large. Please use an image smaller than 4 MB.",
    });
  }

  // Multer: unexpected field or too many files
  if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "There was a problem with the file upload. Please try again.",
    });
  }

  // Multer / upload: rejected file type
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed (JPEG, PNG, GIF, WebP). Please choose a different file.",
    });
  }

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

  // Use the error's own statusCode if set (e.g. from processImage), otherwise 500
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "Something went wrong on our end. Please try again later."
      : err.message || "Something went wrong. Please try again.";

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
