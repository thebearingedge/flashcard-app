const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

exports.authorize = (req, res, next) => {
  const token = req.get('x-access-token');
  if (!token) {
    throw new ClientError(401, 'authentication required');
  } else {
    const { userId, username } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = { userId, username };
    next();
  }
};

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ message: err.message });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ message: 'invalid access token' });
  } else {
    console.error(err);
    res.status(500).json({ message: 'an unexpected error occurred' });
  }
};
