// eslint-disable-next-line no-unused-vars
const {
  isSignUpRequestValid,
  isSignInRequestValid
} = require('../validators/authValidators');

describe('Authentication requests validation', () => {
  let req;

  describe('signUp request validation', () => {
    beforeEach(() => {
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

    it('returns false on a bad request, with the appropriate validation error message', () => {
      delete req.body.email;
      const outcome = isSignUpRequestValid(req.body);
      expect(outcome.is_valid).toBe(false);
      expect(outcome.errors.first('email')).toBe('The email field is required.');
    });

    it('returns true if the request body matches the expected', () => {
      const outcome = isSignUpRequestValid(req.body);
      expect(outcome.is_valid).toBe(true);
    });
  });

  describe('signIn request validation', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'user@user.com',
          password: 'secret',
        },
      };
    });

    it('shows that outcome.is_valid is false on a bad request, with the appropriate validation error message', () => {
      delete req.body.password;
      const outcome = isSignInRequestValid(req.body);
      expect(outcome.is_valid).toBe(false);
      expect(outcome.errors.first('password')).toBe('The password field is required.');
    });

    it('requires the request body should match a particular specification', () => {
      const outcome = isSignInRequestValid(req.body);
      expect(outcome.is_valid).toBe(true);
    });
  });
});

