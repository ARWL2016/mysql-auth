const { db } = require('../db');

const authenticate = (req, res, next) => {
  const token = req.header('X-Auth');
  console.log("AUTH: ", token);

  const sql = "SELECT username FROM user WHERE id = (SELECT userId FROM token WHERE token=?)";

  db.queryAsync(sql, [token])
    .then(rows => {
      console.log(rows);
      if (!rows.length) {
        return Promise.reject();
      }

      req.user = rows[0].user;
      req.token = token; 
      next();
    }).catch(err => {
      res.sendStatus(401);
    });
}

module.exports = { authenticate };