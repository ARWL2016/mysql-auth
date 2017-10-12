const mysql = require('mysql');
const chalk = require('chalk');

const db = mysql.createConnection({
  host: 'localhost', 
  port: 4000, 
  user: 'alistairrwillis', 
  password: 'mko0987uj??', 
  database: 'auth'
}); 

db.connect(err => {
  if (err) {
      console.log(chalk.red('MYSQL: Error connecting: ' + err.stack));
      return;
  }

  console.log(chalk.green(`MYSQL: Connected to ${db.config.host}:${db.config.port} with ID: ${db.threadId}`));
});

module.exports = {
  db
}