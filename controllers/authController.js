
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


module.exports = authController;
