const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes');

const app = express(); 

let port = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
  console.log(chalk.green(`APP.JS: Running on PORT ${port}`))
});



