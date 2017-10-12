function register(username, password) {
  generateHash(password)
    .then(hash => {
      const sql_user = "INSERT INTO auth.user VALUES (DEFAULT, ?, ?)";
      const inserts = [username, hash];
    
      db.query(sql_user, inserts, (e, results, fields) => {
        if (e) {
          return console.log('User could not be added', e);
        }
        const userId = results.insertId;
        console.log(chalk.green(`User was added with id ${userId}`));

        const { access, token } = generateJWT(userId);
        const sql_token = "INSERT INTO auth.token VALUES (DEFAULT, ?, ?, ?)"; 
        const inserts = [userId, access, token];

        db.query(sql_token, inserts, (e, results, fields) => {
          if (e) {
            return console.log('token could not be added', e);
          }
          console.log('token added to db', token);
          db.destroy();
        });
      });
  }).catch(e => console.log('hashing error'));
}