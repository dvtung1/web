require("../utils/db.configuration");

module.exports = (req, res, next) => {
  Backendless.UserService.isValidLogin()
    .then(() => {
      next();
    })
    .catch(err => {
      res.status().json({
        statusCode: err.statusCode,
        message: err.message
      });
    });
};
