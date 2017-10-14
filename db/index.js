const mysql = require('mysql');
const chalk = require('chalk');

const Promise = require("bluebird");

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
// Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE
}); 

db.connect(err => {
  if (err) {
      console.log(chalk.red('MYSQL: Error connecting: ' + err.stack));
      return;
  }

  console.log(chalk.green(`MySQL: Connected to ${db.config.host}:${db.config.port} \n`));
});

module.exports = {
  db
}