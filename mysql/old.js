function login(username, password) {
  
    if (!username || !password) {
      return console.log('enter a username and password');
    }
  
    db.query(sql.selectUser, [username], (error, results, fields) => {
      if (error) {
        console.log('db error');
  
      } else if (!results.length) {
        console.log('username not found');
  
      } else {
        comparePassword(password, results[0].password)
        .then(verified => {
          
          if (!verified) {
            return Promise.reject('passwords do not match')
          } 
          const userId = results[0].id;
          const { access, token } = generateJWT(userId);
  
          db.query(sql.insertToken, [userId, access, token], (e, results, fields) => {
            if (e) {
              return console.log('token could not be added', e);
            }
            console.log('token added to db', token);
          });
  
        }).catch(e => {
          console.log('CAUGHT ERROR', e);
  
        })
      }
    });
    
  }

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