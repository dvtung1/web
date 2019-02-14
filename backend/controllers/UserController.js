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
        message: `User has successfully created account`
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.resendConfirmation = (req, res) => {
  var email = req.body.email;
  Backendless.UserService.resendEmailConfirmation(email)
    .then(() => {
      return res.status(200).json({
        message: "Resend confirmation successfully"
      });
    })
    .catch(err => {
      return res.status(500).json({
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
      var userToken = Backendless.LocalCache.get("user-token");
      var userObjectId = Backendless.LocalCache.get("current-user-id");
      // var userObject = Backendless.UserService.getCurrentUser();

      //send token, objectId, userObject as JSON
      return res.status(200).json({
        userToken: userToken,
        userId: userObjectId
        // userObject: userObject
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: err.message
      });
    });
};

/*
  Recovery password with an email sent along with instruction to set up new password.
  @param req request
  @param res respond
  @return json with result messages
*/
exports.recoveryPassword = (req, res) => {
  var email = req.body.email;
  Backendless.UserService.restorePassword(email)
    .then(() => {
      return res.status(200).json({
        message: "An email has been sent"
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};
