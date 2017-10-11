const mysql = require('mysql');
const { connection } = require('./connection');
const { generateHash, comparePassword, generateJWT } = require('../auth');
const chalk = require('chalk');

function register(username, password) {
  generateHash(password)
    .then(hash => {
      const sql_user = "INSERT INTO auth.user VALUES (DEFAULT, ?, ?)";
      const inserts = [username, hash];
    
      connection.query(sql_user, inserts, (e, results, fields) => {
        if (e) {
          return console.log('User could not be added', e);
        }
        const userId = results.insertId;
        console.log(chalk.green(`User was added with id ${userId}`));

        const { access, token } = generateJWT(userId);
        const sql_token = "INSERT INTO auth.tokens VALUES (DEFAULT, ?, ?, ?)"; 
        const inserts = [userId, access, token];

        connection.query(sql_token, inserts, (e, results, fields) => {
          if (e) {
            return console.log('token could not be added', e);
          }
          console.log('token added to db', token);
          connection.destroy();
        });
      });
  }).catch(e => console.log('hashing error'));
  
}

function deleteUser(username) {
  const sql = "DELETE FROM auth.user WHERE username=?";
  const inserts = [username];

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(chalk.green(`User deleted`));
      connection.destroy();
    }
  });
}

function login(username, password) {

  if (!username || !password) {
    return console.log('enter a username and password');
  }
  // get hash from db
  const sql = "SELECT iduser, username, password FROM auth.user WHERE username=?";
  const inserts = [username];

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log('db error');
      connection.destroy();
    } else if (!results.length) {
      console.log('username not found');
      connection.destroy();
    } else {
      comparePassword(password, results[0].password)
      .then(verified => {
        
        if (!verified) {
          return Promise.reject('passwords do not match')
        } 
        const userId = results[0].iduser;
        const { access, token } = generateJWT(userId);

        const sql_token = "INSERT INTO auth.tokens VALUES (DEFAULT, ?, ?, ?)"; 
        const inserts = [userId, access, token];

        connection.query(sql_token, inserts, (e, results, fields) => {
          if (e) {
            return console.log('token could not be added', e);
          }
          console.log('token added to db', token);
          connection.destroy();
        });

      }).catch(e => {
        console.log('CAUGHT ERROR', e);
        connection.destroy();
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

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results.length !== 0);
    }
    connection.destroy();
  });
}

module.exports = { register, deleteUser, login, checkUsernameExists };


