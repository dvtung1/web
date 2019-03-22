/*
  Controller file that contain all the logic business for User. Link to UserRoutes
*/

"use strict";

var Backendless = require("../utils/db.configuration"); //initialize backendless database
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
  user.username = req.body.email;

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

exports.logOut = (req, res) => {
  Backendless.UserService.logout()
    .then(() => {
      return res.status(200).json({
        message: "User has been logged out"
      });
    })
    .catch(err => {
      return res.status(500).json({
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

/*
  Change email by visiting the manage account page and entering the new email you want associated with your account
  @param req request
  @param res respond
  @return json with result messages
*/
exports.modifyEmail = (req, res) => {
  var newEmail = req.body.email;
  //Backendless.UserService.getCurrentUser() was not working
  // so just get the objectid and update manually
  var userobjectid = Backendless.LocalCache.get("current-user-id");
  Backendless.Data.of("Users")
    .findById(userobjectid)
    .then(currentUser => {
      currentUser.email = newEmail;
      Backendless.Data.of("Users").save(currentUser);
      return res.status(200).json({
        message: "Email changed successfully"
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

/*
  Change password by visiting the manage account page and entering the new password you want associated with your account
  @param req request
  @param res respond
  @return json with result messages
*/

exports.modifyPassword = (req, res) => {
  var newPassword = req.body.password;
  var userobjectid = Backendless.LocalCache.get("current-user-id");
  Backendless.Data.of("Users")
    .findById(userobjectid)
    .then(currentUser => {
      currentUser.password = newPassword;
      Backendless.Data.of("Users")
        .save(currentUser)
        .then(savedobject => {
          // have to login user with the new password
          // only for modifying password
          Backendless.UserService.login(currentUser.email, newPassword, true);
        })
        .catch();

      return res.status(200).json({
        message: "Password changed successfully"
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.modifyUsername = (req, res) => {
  var newUsername = req.body.username;
  var userobjectid = Backendless.LocalCache.get("current-user-id");
  Backendless.Data.of("Users")
    .findById(userobjectid)
    .then(currentUser => {
      currentUser.username = newUsername;
      Backendless.Data.of("Users").save(currentUser);
      return res.status(200).json({
        message: "Username changed successfully"
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.checkIfUserLoggedIn = (req, res) => {
  // can use getCurrentUser to get a email/username instead isValidLogin()
  Backendless.UserService.isValidLogin()
    .then(result => {
      return res.status(200).json({
        message: "" + result
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.getCurrentUserInfo = (req, res) => {
  // this allows the user to view updated information after reloading
  //Backendless.UserService.getCurrentUser() was not letting this happen
  // get objectid for cache, and find user manually
  var userobjectid = Backendless.LocalCache.get("current-user-id");
  Backendless.Data.of("Users")
    .findById(userobjectid)
    .then(result => {
      return res.status(200).json({
        // will not return or display password
        userEmail: result.email,
        userUserName: result.username
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};
