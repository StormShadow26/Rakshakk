const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findOne({ email: decoded.email, token });
      if (!user) {
        return res.status(401).json({ message: 'Invalid token or user not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
      }

      req.user = user;
      next();

    } catch (err) {
      res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
};

module.exports = authorizeRoles;