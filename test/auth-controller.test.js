const request = require('supertest');
const expect = require('chai').expect;
const { app } = require('../app.js');
const { resetUserTable } = require('./mock-data');
const { db } = require('../db');

const userInDb = {username: 'cat', password: '123'};
const userNotInDb = {username: 'dog', password: '321'};

beforeEach(resetUserTable);

describe('The register function', () => {
  it('should add a JWT to the header and send back the username', (done) => {
    request(app)
      .post('/api/auth/register')
      .send(userNotInDb)
      .expect(200)
      .expect(res => {
        expect(res.body.username).to.equal(userNotInDb.username);
        expect(res.headers['x-auth']).to.be.a('string');
        expect(res.headers['x-auth'].length).to.be.above(100);
      })
      .end(done);
  });

});

describe('The login function', () => {
  it('should add a JWT to the header and send back the username for an existing user', (done) => {
    request(app)
      .post('/api/auth/login')
      .send(userInDb)
      .expect(200)
      .expect(res => {
        expect(res.body.username).to.equal(userInDb.username);
        expect(res.headers['x-auth']).to.be.a('string');
        expect(res.headers['x-auth'].length).to.be.above(100);
      })
      .end(done);
  });

});

describe('The deleteUser function', () => {
  it('should delete a user', (done) => {
    
    request(app)
      .delete('/api/auth/deleteUser')
      .send(userInDb)
      .expect(200)
      .expect(res => {
        expect(res.body.message).to.equal('user was deleted');
      })
      .end(() => {
        db.queryAsync("SELECT username FROM user WHERE username=?", [userInDb.username])
        .then(rows => {
          expect(rows.length).to.equal(0);
          done();
        });
      });
  });
});

describe('The checkUsernameExists function', () => {
  it('should return true if username exists in database', (done) => {
    request(app)
      .post('/api/auth/checkUsername')
      .send(userInDb)
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('object');
        expect(res.body.response).to.be.true;
      })
      .end(done);
  });

  it('should return false if username does not exist in database', (done) => {
    request(app)
      .post('/api/auth/checkUsername')
      .send(userNotInDb)
      .expect(200)
      .expect(res => {
        expect(res.body.response).to.be.false;
      })
      .end(done);
  });
});