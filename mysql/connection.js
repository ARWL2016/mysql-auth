const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', 
  port: 4000, 
  user: 'alistairrwillis', 
  password: 'Mko0987uj??', 
  database: 'auth'
}); 

db.connect((err) => {
  if (err) {
      console.log('error connecting: ' + err.stack);
      return;
  }

  console.log(`connected to ${db.config.host}:${db.config.port} with ID: ${db.threadId}`);
});

module.exports = {
  db
}