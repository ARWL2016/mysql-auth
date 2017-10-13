require('./config');

const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
chalk = require('chalk'),
routes = require('./routes'),

app = express(); 
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send({message: 'Authentication app is running'});
}); 

routes(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(chalk.green(`APP.JS: Running on PORT ${port}`))
  });
}

module.exports = { app };



