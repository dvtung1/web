/*
  Controller file that contain all the logic business for User. Link to UserRoutes
*/

require("../utils/db.configuration"); //initialize backendless database

/*
  Create new account.
  @param req http request
  @param res http respond
  @return json including statusCode and message
*/
exports.createAccount = (req, res) => {
  var user = new Backendless.User();
  user.email = req.body.email;
  user.password = req.body.password;

  //register for new account using backendless API
  Backendless.UserService.register(user)
    .then(user => {
      //send back json include user and message
      return res.status(201).json({
        user: user,
        message: `User ${user.email} has successfully created account`
      });
    })
    .catch(err => {
      return res.status(500).json({
        statusCode: err.statusCode,
        message: err.message
      });
    });
};

/*
  Log in exist account.
  @param req http request
  @param res http respond
  @return json including statusCode and message
*/
exports.signIn = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  //use backendless api to log in, "true" means the user login info will be saved
  Backendless.UserService.login(email, password, true)
    .then(loggedinUser => {
      return res.status(200).json({
        user: loggedinUser,
        message: `User ${loggedinUser.email} has successfully logged in`
      });
    })
    .catch(err => {
      return res.status(500).json({
        statusCode: err.statusCode,
        message: err.message
      });
    });
};
