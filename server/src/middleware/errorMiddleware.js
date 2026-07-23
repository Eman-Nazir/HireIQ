export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again.';

  // Mongoose bad ObjectId (e.g. malformed resume/user ID in URL)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose validation errors (e.g. missing required field)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `This ${field} is already in use`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid session, please log in again';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  // Multer file size limit
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File is too large. Maximum size is 5MB';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};