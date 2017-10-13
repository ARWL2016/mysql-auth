const request = require('supertest');
const expect = require('expect');

const { app } = require('../app.js');

describe('Mocha', () => {
  it('should run the test script', () => {
    expect(true).toBe(true);
  });
});

describe('Root GET request', () => {
  it('should respond with 200', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});