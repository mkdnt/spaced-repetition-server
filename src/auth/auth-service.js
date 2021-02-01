const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
require('dotenv').config()

const AuthService = {
  getUserWithUserName(db, username) {
    return db("user").where({ username }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      subject,
      algorithm: "HS256",
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
};

module.exports = AuthService;