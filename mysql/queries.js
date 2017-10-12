const mysql = require('mysql');
const { db } = require('./connection');
const { generateHash, comparePassword, generateJWT } = require('../auth');
const chalk = require('chalk');
const Promise = require("bluebird");
// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
// Promise.promisifyAll(require("mysql/lib/Pool").prototype);

function register(username, password) {
  generateHash(password)
    .then(hash => {
      const sql_user = "INSERT INTO auth.user VALUES (DEFAULT, ?, ?)";
      const inserts = [username, hash];
    
      db.query(sql_user, inserts, (e, results, fields) => {
        if (e) {
          return console.log('User could not be added', e);
        }
        const userId = results.insertId;
        console.log(chalk.green(`User was added with id ${userId}`));

        const { access, token } = generateJWT(userId);
        const sql_token = "INSERT INTO auth.token VALUES (DEFAULT, ?, ?, ?)"; 
        const inserts = [userId, access, token];

        db.query(sql_token, inserts, (e, results, fields) => {
          if (e) {
            return console.log('token could not be added', e);
          }
          console.log('token added to db', token);
          db.destroy();
        });
      });
  }).catch(e => console.log('hashing error'));
  
}

function deleteUser(username) {
  const sql = "DELETE user, token FROM user INNER JOIN token WHERE user.username = ? AND token.userId = user.id;";
  const inserts = [username];

  db.queryAsync(sql, inserts)
  .then(() => {
    console.log('User deleted');
    next();

  }).catch(e => next(e));
}

function login(username, password) {

  if (!username || !password) {
    return console.log('enter a username and password');
  }
  // get hash from db
  const sql = "SELECT id, username, password FROM auth.user WHERE username=?";
  const inserts = [username];

  db.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log('db error');
      db.destroy();
    } else if (!results.length) {
      console.log('username not found');
      db.destroy();
    } else {
      comparePassword(password, results[0].password)
      .then(verified => {
        
        if (!verified) {
          return Promise.reject('passwords do not match')
        } 
        const userId = results[0].id;
        const { access, token } = generateJWT(userId);

        const sql_token = "INSERT INTO auth.token VALUES (DEFAULT, ?, ?, ?)"; 
        const inserts = [userId, access, token];

        db.query(sql_token, inserts, (e, results, fields) => {
          if (e) {
            return console.log('token could not be added', e);
          }
          console.log('token added to db', token);
          db.destroy();
        });

      }).catch(e => {
        console.log('CAUGHT ERROR', e);
        db.destroy();
      })
    }
  });
  
}

function checkUsernameExists(username) {
  if (!username) {
    return console.log('enter a username');
  }

  const sql = "SELECT username FROM auth.user WHERE username=?";
  const inserts = [username];

  db.queryAsync(sql, inserts)
    .then(rows => {
      console.log(rows.length === 1);
      next();
    })
    .catch(e => next(e));
}



function next(e) {
  if (e) console.log('CAUGHT ERROR', e);
  db.destroy();
}

module.exports = { register, deleteUser, login, checkUsernameExists };


