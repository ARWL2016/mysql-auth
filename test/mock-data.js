const { db } = require('../db');
const { generateHash, generateJWT } = require('../helpers/auth-helpers');
const { sql } = require('../controllers/auth-controller');

const resetUserTable = (done) => {
    
    const user = {username: 'cat', password: '123'};
    let token = '';

    db.queryAsync("DELETE FROM user")
      .then(rows => {
        return generateHash(user.password);
      })
      .then(hash => {
        return db.queryAsync(sql.insertCredentials, [user.username, hash]); 
      })
      .then(rows => {
        const userId = rows.insertId;
        const jwt = generateJWT(userId);
        const { access } = jwt;
        token = jwt.token;
        
        return db.queryAsync(sql.insertToken, [userId, access, token]);
      })
      .then(() => {
        done();
      })
      .catch(e => console.log(e));
}

module.exports = { resetUserTable }; 