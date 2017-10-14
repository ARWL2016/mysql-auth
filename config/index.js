const chalk = require('chalk');
let env = process.env.NODE_ENV || 'development';
let config = {};

console.log(chalk.green(`App running in ${env} mode`));
console.log(chalk.blue('-----------------------------'));

if (env === 'development' ) {
  config = require('./development.json');
} else if (env === 'test') {
  config = require('./test.json');
}

Object.keys(config).forEach(key => {
  process.env[key] = config[key];
  console.log(chalk.blue(`${key}: ${process.env[key]}`)); 
});

console.log(chalk.blue('-----------------------------'));