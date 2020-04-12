// eslint-disable-next-line no-unused-vars
const should = require('should');
const sinon = require('sinon');

const {
  isSignUpRequestValid,
  isSignInRequestValid
} = require('../validators/auth_validators');

const {
  isCreateTripRequestValid,
  isTripRequestValid
} = require('../validators/trip_validators')


suite('Authentication request validation', () => {
  let req;

  suite('signUp request validation', () => {
    setup(() => {
      req = {
        body: {
          email: 'user@user.com',
          password: 'secret',
          password_confirmation: 'secret',
          first_name: 'John',
          last_name: 'Doe',
        }
      };
    });

    test('the outcome.is_valid is false on a bad request, with the appropriate validation error message', () => {
      delete req.body.email;
      const outcome = isSignUpRequestValid(req.body);
      outcome.is_valid.should.equal(false);
      outcome.errors.first('email').should.equal('The email field is required.');
    });

    test('the outcome.is_valid is true if the request body matches the expected', () => {
      const outcome = isSignUpRequestValid(req.body);
      outcome.is_valid.should.equal(true);
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
    });

    test('the outcome.is_valid is false on a bad request, with the appropriate validation error message', () => {
      delete req.body.password;
      const outcome = isSignInRequestValid(req.body);
      outcome.is_valid.should.equal(false);
      outcome.errors.first('password').should.equal('The password field is required.');
    });

    test('the signin request body should match a particular specification', () => {
      const outcome = isSignInRequestValid(req.body);
      outcome.is_valid.should.equal(true);
    });
  });
});


suite('Trip requests validation', () => {
  const commonRules = {
    token: 'eiorjpgoavertulongstring',
    is_admin: true,
    user_id: '147',
  };

  suite('create trips request validation', () => {
    let req;
    setup(() => {
      req = {
        body: {
          ...commonRules,
          bus_id: '1',
          origin: 'benin',
          destination: 'lagos',
          trip_date: '2020-04-12T07:48:12.277Z',
          fare: '5000.00'
        }
      };
    });
    test('the validation fails on a bad request, with the appropriate validation error message', () => {
      delete req.body.fare;
      delete req.body.is_admin;
      delete req.body.user_id;
      const outcome = isCreateTripRequestValid(req.body);
      outcome.is_valid.should.equal(false);
      outcome.errors.first('fare').should.equal('The fare field is required.');
      outcome.errors.first('is_admin').should.equal('The is_admin field is required.');
      outcome.errors.first('user_id').should.equal('The user_id field is required.');
    });
    test('The validation passes when the request body matches the specification', () => {
      const outcome = isTripRequestValid(commonRules);
      outcome.is_valid.should.equal(true);
    });
  });
});