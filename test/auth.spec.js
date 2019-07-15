// eslint-disable-next-line no-unused-vars
const should = require('should');
const sinon = require('sinon');
const authController = require('../controllers/authController')();

suite('Authentication', () => {
  let req;
  let res;

  suite('signUp', () => {
    setup(() => {
      req = {
        body: {
          email: 'user@user.com',
          password: 'secret',
          first_name: 'John',
          last_name: 'Doe',
        }
      };

      res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        data: {
          user_id: 1,
          is_admin: true,
          token: 'some_token',
        }
      };
    });


    test('the response returns a status of 201 on success and 400 on error', () => {
      authController.signUp(req, res);
      res.status.calledWith(201).should.equal(true, 'success');
      res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    });
  });

  suite('signIn', () => {
    setup(() => {
      req = {
        body: {
          email: 'user@user.com',
          password: 'secret',
        },
      };
      res = {
        status: sinon.spy(),
        data: {
          user_id: 1,
          is_admin: true,
          token: 'some_token',
        }
      };
    });

    test('the response returns a status of 200 on success and 400 on error', () => {
      authController.signIn(req, res);
      res.status.calledWith(200).should.equal(true, 'success');
      res.status.calledWith(400).should.equal(true, `Bad status ${res.status.args[0][0]}`);
    });
  });
});
