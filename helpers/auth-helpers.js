const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function generateHash(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateJWT (userId) {
  const JWT_SECRET = 'secret';
  const access = 'auth';
  const token = jwt.sign({_id: userId, access: access }, JWT_SECRET).toString();
  return {access, token};
}


module.exports = { generateHash, comparePassword, generateJWT };