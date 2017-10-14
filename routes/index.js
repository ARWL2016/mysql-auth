const { register, deleteUser, login, checkUsernameExists, logout } = require('../controllers/auth-controller');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {
  app.post('/api/auth/register', register); 
  app.post('/api/auth/checkUsername', checkUsernameExists);
  app.delete('/api/auth/deleteUser', deleteUser);
  app.post('/api/auth/login', login);
  app.delete('/api/auth/logout', authenticate, logout);
}