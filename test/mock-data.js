const { db } = require('../db');


const resetUserTable = (done) => {
    const sql = 'DELETE FROM auth.user'; 

    db.queryAsync(sql)
      .then(rows => {
        console.log(rows); 
      })
      .catch(e => console.log(e));
}

module.exports = { resetUserTable }; 