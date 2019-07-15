const pgPool = require('../config/pgPool');

function authController() {
  function signIn(req, res) {
    // const error = false;

    // if (error) {
    //   res.status(400);
    //   res.send('The request does not meet the required specification');
    // } else {
    //   res.status(200);
    //   return res.send('user created');
    // }
    res.send({});
  }

  function signUp(req, res) {
    // res.status(201);
    // return res.send('user created');
    res.send({});
  }

  return { signIn, signUp };
}

// let Validator = require('validatorjs');
// let data = {
//   name: 'John',
//   email: 'johndoe@gmail.com',
//   age: 28
// };

// let rules = {
//   name: 'required',
//   email: 'required|email',
//   age: 'min:18'
// };

// let validation = new Validator(data, rules);

// validation.passes(); // true
// validation.fails();
module.exports = authController;
