

const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email, token });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user no longer exists.' });
    }

    req.user = user; // store user data in request
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = authenticate;