const { register, deleteUser, login, checkUsernameExists } = require('./mysql/queries');
const chalk = require('chalk');

const args = process.argv; 

const method = args[2];
const username = args[3];
const password = args[4];

console.log(chalk.red(`${method} ${username}`));

switch (method) {
  case 'add':
  case 'register': 
  case 'reg':  
    register(username, password);
    break;
  case 'del': 
  case 'delete': 
  case 'rem': 
  case 'remove': 
    deleteUser(username);
    break;
  case 'login': 
    login(username, password);
    break;
  case 'check':
    checkUsernameExists(username); 
    break;
  default: 
    console.log('unknown method');
}


