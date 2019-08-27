import request from 'supertest';

const server = request.agent('http://localhost:8089/v1.0');
const uniqEmail = Math.floor(100000 + Math.random() * 900000);
let authToken = '';
let token = '';
let boardId = '';
const userEmail = `abhishek${uniqEmail}@mailinator.com`;

describe('Create User', () => {
  it('respond with json', (done) => {
    server
      .post('/users')
      .set('Content-Type', 'multipart/form-data')
      .field('password', '123456789')
      .field('email', userEmail)
      .field('first_name', 'Abhishek')
      .field('last_name', 'Gangrade')
      .field('address', 'Indore')
      .expect(200)
      .end((err, data) => {
        if (err) return done(err);
        authToken = data.body.success.data;
        done();
      });
  });
});

describe('Verify User', () => {
  it('respond with json', (done) => {
    server
      .get(`/users/verify/${authToken}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('Login User', () => {
  it('respond with json', (done) => {
    server
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: userEmail, password: '123456789' })
      .expect(200)
      .end((err, data) => {
        if (err) return done(err);
        token = data.body.success.data.token;
        done();
      });
  });
});

describe('Create Board', () => {
  it('respond with json', (done) => {
    server
      .post('/boards')
      .set('Content-Type', 'multipart/form-data')
      .field('board_title', 'Trello Clone')
      .field('board_description', 'Creatin a treelo clone')
      .set({ Authorization: token })
      .expect(201)
      .end((err, data) => {
        if (err) return done(err);
        boardId = data.body.success.data;
        done();
      });
  });
});

describe('Update Board', () => {
  it('respond with json', (done) => {
    server
      .put('/boards')
      .set('Content-Type', 'multipart/form-data')
      .field('board_title', 'Trello Clone')
      .field('board_description', 'Creating a trello clone')
      .field('board_id', boardId)
      .set({ Authorization: token })
      .expect(201)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('Invite', () => {
  it('respond with json', (done) => {
    server
      .post('/boards/inviteUser')
      .set('Content-Type', 'application/json')
      .send({ email: `abhishekInvited${uniqEmail}@mailinator.com`, board_id: boardId })
      .set({ Authorization: token })
      .expect(201)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
