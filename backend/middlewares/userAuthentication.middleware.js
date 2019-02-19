require("../utils/db.configuration");

module.exports = (req, res, next) => {
  Backendless.UserService.isValidLogin()
    .then(result => {
      if (result) {
        next();
      } else {
        res.status(401).json({
          message: "Unauthorized"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        statusCode: err.statusCode,
        message: err.message
      });
    });
};
