const Database = require("../utils/db.configuration");

var createAccount = (email, password) => {
  var user = new Database.User();
  user.email = email;
  user.password = password;
  Database.UserService.register(user)
    .then(user => {
      console.log(user);
    })
    .catch(err => {
      console.log(err);
    });
};

var signIn = (email, password) => {
  Database.UserService.login(email, password, false)
    .then(loggedinUser => {
      console.log("Welcome user " + loggedinUser.email);
    })
    .catch(err => {
      console.log(err);
    });
};
