const {
  isCreateTripRequestValid,
  isTripRequestValid
} = require('../validators/tripValidators');


describe('Trip requests validation', () => {
  describe('create trips request validation', () => {
    let req;
    beforeEach(() => {
      req = {
        body: {
          user_id: '1',
          bus_id: '1',
          origin: 'benin',
          destination: 'lagos',
          trip_date: '2020-04-12T07:48:12.277Z',
          fare: '5000.00'
        }
      };
    });
    it('the validation fails on a bad request, with the appropriate validation error message', () => {
      delete req.body.fare;
      delete req.body.user_id;
      const outcome = isCreateTripRequestValid(req.body);
      expect(outcome.is_valid).toBe(false);
      expect(outcome.errors.first('fare')).toBe('The fare field is required.');
      expect(outcome.errors.first('user_id')).toBe('The user_id field is required.');
    });
    it('The validation passes when the request body matches the specification', () => {
      const outcome = isTripRequestValid(req.body);
      expect(outcome.is_valid).toBe(true);
    });
  });
});
