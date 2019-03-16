var Backendless = require("../utils/db.configuration"); //initialize backendless database

exports.postRating = (req, res) => {
  console.log(req.body.rating);
  return res.status(200).json({
    message: "Received rating from rpi successfully"
  });
};
