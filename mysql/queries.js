const mysql = require('mysql');
const { connection } = require('./connection');
const { generateHash, comparePassword, generateJWT } = require('../auth');
const chalk = require('chalk');

function addUser(username, password) {
  generateHash(password)
    .then(hash => {
      const sql = "INSERT INTO auth.user VALUES (DEFAULT, ?, ?)";
      const inserts = [username, hash];
    
      connection.query(sql, inserts, (error, results, fields) => {
        if (error) console.log(error);
    
        console.log(chalk.green(`User was added with id ${results.insertId}`));

        const {access, token } = generateJWT(results.insertId);

        // add JWT to table 
        // send back to user



        console.log(access, token);
        connection.destroy();
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
  const sql = "SELECT username, password FROM auth.user WHERE username=?";
  const inserts = [username];

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log('User not found');
    } else {
      comparePassword(password, results[0].password)
        .then(verified => {
          console.log(`Passwords match: ${verified}`);
          connection.destroy();
        });
    }
  });


  

}

module.exports = { addUser, deleteUser, login };


