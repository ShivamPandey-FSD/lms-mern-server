const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
 try {
  return jwt.verify(token, secret);
 } catch (error) {
  return null;
 }
}

module.exports = verifyToken;
