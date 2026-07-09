const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fields,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
