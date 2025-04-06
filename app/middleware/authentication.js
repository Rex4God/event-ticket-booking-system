const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        error: 'Unauthorized',
        message: 'Token is missing or invalid.',
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        error: 'Unauthorized',
        message: 'Token payload is invalid.',
      });
    }

    req.user = { userId: payload.userId };
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      error: 'Unauthorized',
      message: 'Token has expired or is invalid.',
    });
  }
};
