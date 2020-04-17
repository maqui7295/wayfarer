const request = require('supertest');

const app = require('../../index');
const userRepository = require('../../repositories/userRepository');

const agent = request.agent(app);


describe('User crud test', () => {
  afterEach(async () => {
    await userRepository.deleteRow('email', 'test@gmail.com');
  });

  it('should allow a new user to be posted and returned as logged in', async () => {
    const userPost = {
      email: 'test@gmail.com',
      password: '12345678',
      password_confirmation: '12345678',
      first_name: 'Mark',
      last_name: 'Edosa'
    };

    const result = await agent
      .post('/api/v1/auth/signup')
      .send(userPost)
      .expect(201);

    expect(result.body.auth).toBe(true);
  });

});