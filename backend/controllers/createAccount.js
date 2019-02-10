const backendless = require("../utils/db.configuration");

var createAccount = (email, password) => {
  var user = new backendless.User();
  user.email = email;
  user.password = password;
  backendless.UserService.register(user)
    .then(user => {
      console.log(user);
    })
    .catch(err => {
      console.log(err);
    });
};
