const errorHandler = (err, req, res, next) => {
  // Log error to developer
  console.log(err);

  res.status(500).json({
    success: false,
    error: err.stack,
  });
};

module.exports = errorHandler;
