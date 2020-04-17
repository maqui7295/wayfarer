const userRepository = require('../repositories/userRepository');
const authController = require('../controllers/authController')();


describe('authentication and database calls', () => {
  describe('creating and returning users', () => {
    let req, user;
    const res = jasmine.createSpyObj('res', ['status', 'json']);
    beforeEach(async () => {
      req = {
        body: {
          email: 'test@user.com',
          password: 'secretpassword',
          first_name: 'Johnny',
          last_name: 'DoeCash',
        }
      };
      user = await userRepository.createUser(req.body);
    });

    afterEach(async () => {
      await userRepository.deleteById(user.id);
    });

    it('should return the user that was created', async () => {
      const sameUser = await userRepository.findUserByEmail(user.email);
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
