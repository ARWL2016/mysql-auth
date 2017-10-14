const mysql = require('mysql');
const { db } = require('../db');
const { generateHash, comparePassword, generateJWT } = require('../helpers/auth-helpers');
const chalk = require('chalk');

const sql = {
  selectUsername: "SELECT username FROM user WHERE username=?", 
  insertCredentials: "INSERT INTO user VALUES (DEFAULT, ?, ?)", 
  insertToken: "INSERT INTO token VALUES (DEFAULT, ?, ?, ?)", 
  removeToken: "DELETE FROM token WHERE token=?",
  usernameExists: "SELECT username FROM user WHERE username=?", 
  deleteUser: "DELETE user, token FROM user INNER JOIN token WHERE user.username = ? AND token.userId = user.id;", 
  selectUser: "SELECT id, username, password FROM user WHERE username=?", 
  checkTokenExists: "SELECT token FROM token WHERE userId=?"
}

const promiseCache = {
  userId: '', 
  token: '', 
  username: ''
};

function register(req, res) {
  const { username, password } = req.body;
  promiseCache.username = username;
 
  if (!username || !password) {
    return res.status(401).send({Error: 'incomplete credentials'});
  }

  db.queryAsync(sql.selectUsername, [username])
    .then(rows => {
      if (rows.length === 1) {
        return Promise.reject({code: 409, message: 'username exists'});
      } 

      return generateHash(password);
    })
    .then(hash => {
      return db.queryAsync(sql.insertCredentials, [promiseCache.username, hash]);
    })
    .then(rows => {
        const userId = rows.insertId;
        const jwt = generateJWT(userId);
        const { access } = jwt;
        promiseCache.token = jwt.token;

        return db.queryAsync(sql.insertToken, [userId, access, promiseCache.token])
    })
    .then(rows => {
      res.header('X-Auth', promiseCache.token).send({username: promiseCache.username});
    })
    .catch(e => {
      const {code, message} = e;
      res.status(500).send({message});
      console.log(e);
    });
}

function deleteUser(req, res) {
  const { username } = req.body;

  db.queryAsync(sql.deleteUser, [username])
  .then(rows => {
    const message = (rows.affectedRows > 0) ? 'user was deleted' : 'user did not exist';
    res.status(200).send({message});
    
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });
}

function login (req, res) {
  const { username, password } = req.body; 
  promiseCache.username = username; 

  if (!username || !password) {
    return res.status(401).send({Error: 'incomplete credentials'});
  }

  db.queryAsync(sql.selectUser, [username])
    .then(rows => {
      if (!rows.length) {
        return res.status(400).send({error: 'user not found'});
      }
      userId = rows[0].id;
      
      return comparePassword(password, rows[0].password);
    })
    .then(result => {
      if (!result) {
        Promise.reject({code: 400, message: 'incorrect password'});
      } 
      // check if JWT already available 
      return db.queryAsync(sql.checkTokenExists, [userId]);
    })
    .then(rows => {
        if (rows.length) {
          return res.header('X-Auth', rows[0].token);
        } 

        const jwt = generateJWT(userId);
        const { access } = jwt;
        promiseCache.token = jwt.token; 
        res.header('X-Auth', promiseCache.token);
  
        return db.query(sql.insertToken, [userId, access, promiseCache.token]);
    })
    .then(() => {
      return res.send({username: promiseCache.username});
    })
    .catch(e => {
      console.log(e);
      const {code, message} = e;
      res.status(code).send({message}); 
    });
}

function logout(req, res) {
  const { username, token } = req.body;

  db.queryAsync(sql.removeToken, [token])
    .then(() => {
      res.status(200).send({success: `${username} was logged out`});
    })
    .catch(e => {
      res.status(400).send({error: 'An error occured while logging out'}); 
    });
}

function checkUsernameExists(req, res) {

  const  { username } = req.body;
  console.log({username});
  if (!username) {
    return res.status(400).send({error: "username expected"});
  }

  db.queryAsync(sql.usernameExists, [username])
    .then(rows => {
      const response = rows.length > 0;
      res.status(200).json({response});
    })
    .catch(e => next(e));
}

module.exports = { register, deleteUser, login, logout, checkUsernameExists, sql };


