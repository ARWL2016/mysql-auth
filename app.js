const { addUser, deleteUser, login } = require('./mysql/queries');
const chalk = require('chalk');

const args = process.argv; 

const method = args[2];
const username = args[3];
const password = args[4];

console.log(chalk.red(`${method} ${username}`));

switch (method) {
  case 'add': 
    addUser(username, password);
    break;
  case 'del': 
    deleteUser(username);
    break;
  case 'login': 
    login(username, password);
    break;
  default: 
    console.log('unknown method');
}


