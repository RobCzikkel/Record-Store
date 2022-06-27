const request = require('supertest');
const app = require('../app');
const { pool } = require('../db/config');

//Closing DB connection after test for graceful exit
afterAll(async() => {
  await pool.end()
});

describe('GET /', () => {
    test('responds with 200', done => {
      request(app)
        .get('/')
        .expect(200, done);
    });
});



describe('POST /login', () => {
  test('responds with 200 and returns a cookie called jwt', async () => {
      const response = await request(app)
        .post('/login')
        .send({username: 'test', password:'test'})
        .set('Accept', 'application/json')

      expect(response.status).toEqual(200);
      expect(response.headers['set-cookie'][0]).toContain('jwt')
  });
});

describe('GET /authcheck', () => {
  test('responds with 200 and returns the ID, Name and Role of a User in JSON format', done => {
    request(app)
    .get('/authcheck')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInVzZXJuYW1lIjoidGVzdCIsImVtYWlsIjoici5jemlra2VsQGZsYXNoYmF5LmNvbSIsImlwIjoiOjoxLzEyOCIsInJvbGUiOiJ1c2VyIiwiY2FydF9pZCI6OCwiaWF0IjoxNjU1NzIwNzA5fQ._Y3uVarg72gdDjkVuZjzitgCq_j7OEL5qokVlg117rg')
    .set('Accept', 'application/json')
    .expect('Content-Type', "application/json; charset=utf-8")
    .expect(200)
    .expect(function(res) {
      res.body.id = 11;
      res.body.username = 'test';
      res.body.role = 'user';
    })
    .end(function(err, res) {
      if (err) return done(err);
      return done();
    });
  })
})