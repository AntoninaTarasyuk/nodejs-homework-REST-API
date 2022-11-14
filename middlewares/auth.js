const { Unauthorized } = require('http-errors');
const jwt = require("jsonwebtoken");
const User = require('../models/users.model');
const { JWT_SECRET } = process.env;

const auth = async(req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [tokenType, token] = authHeader.split(' ');
  if (tokenType === 'Bearer' && token) {
    try {
      const veryfiedToken = jwt.verify(token, JWT_SECRET);
      console.log('tokenIsValid', veryfiedToken);

      const user = await User.findById(veryfiedToken._id);
      if (!user) { next(new Unauthorized('No user with such id')) };
      if (!user.token) { next(new Unauthorized('Token is invalid')) };
      req.user = user;
      return next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') { next(new Unauthorized(error.name)) };
      if (error.name === 'JsonWebTokedError') { next(new Unauthorized(error.name)) };
      throw error;
    }
  };
  next(new Unauthorized());
};

module.exports = auth;