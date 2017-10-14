const request = require('supertest');
const expect = require('chai').expect;
const { app } = require('../app.js');
const { resetUserTable } = require('./mock-data');
const { db } = require('../db');

const userInDb = {username: 'cat'};
const userNotInDb = {username: 'dog'};

beforeEach(resetUserTable);

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
        db.queryAsync("SELECT username FROM user WHERE username=?", ['cat'])
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