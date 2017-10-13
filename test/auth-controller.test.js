const request = require('supertest');
const expect = require('chai').expect;
const { app } = require('../app.js');

describe('Auth Controller Method: checkUsernameExists', () => {
  it('should return true if username exists in database', (done) => {
    const user = {"username": "cat", "password": "123"};
    request(app)
      .post('/api/auth/checkUsername')
      .send(user)
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('object');
        expect(res.body.response).to.be.true;
      })
      .end(done);
  });

  it('should return false if username does not exist in database', (done) => {
    const user = {"username": "arw", "password": "123"};
    request(app)
      .post('/api/auth/checkUsername')
      .send(user)
      .expect(200)
      .expect(res => {
        expect(res.body.response).to.be.false;
      })
      .end(done);
  });
});