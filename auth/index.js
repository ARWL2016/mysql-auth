const bcrypt = require('bcryptjs');


function generateHash(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}


module.exports = { generateHash, comparePassword };