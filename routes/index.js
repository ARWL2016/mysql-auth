const { register, deleteUser, login, checkUsernameExists } = require('../mysql/queries');

module.exports = (app) => {
  app.post('/api/auth/register', register); 
  app.post('/api/auth/checkUsername', checkUsernameExists);
  app.delete('/api/auth/deleteUser', deleteUser);
  app.post('/api/auth/login', login);
}