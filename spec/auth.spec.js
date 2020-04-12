const userRepository = require('../repositories/userRepository');
const authController = require('../controllers/authController')();


describe('authentication and database calls', () => {
  describe('creating and returning users', () => {
    let req;
    const res = jasmine.createSpyObj('res', ['status', 'json']);
    beforeEach(async () => {
      req = {
        body: {
          email: 'user@user.com',
          password: 'secretpassword',
          first_name: 'Johnny',
          last_name: 'DoeCash',
        }
      };
      await userRepository.createUser(req.body);
    });

    afterEach(async () => {
      await userRepository.deleteRow('email', req.body.email);
    });

    it('should return the user that was created', async () => {
      const sameUser = await userRepository.findUserByEmail(req.body.email);
      expect(sameUser.email).toBe(req.body.email);
    });

    it('should sign in the user successfully', async () => {
      await authController.signIn(req, res);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledBefore(res.json);
    });
  });
});
