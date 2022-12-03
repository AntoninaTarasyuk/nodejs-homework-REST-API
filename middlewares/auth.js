const { Unauthorized } = require('http-errors');
const jwt = require("jsonwebtoken");
const { User } = require('../models/users.model');
const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [tokenType, token] = authHeader.split(' ');
    if (!token || tokenType !== 'Bearer') { throw new Unauthorized('Not authorized'); };
    const {_id} = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);
    if (!user || !user.token) { throw new Unauthorized('Not authorized'); };
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized(error.message));
  }
};

module.exports = auth;