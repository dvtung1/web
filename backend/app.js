/*
    Express file: use all the predefined routes and dependencies.
*/

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const CORS = require("./middlewares/CORS.middleware");

const userRoutes = require("./routes/UserRoutes");
const diningRoutes = require("./routes/DiningRoutes");
const rpiRoutes = require("./routes/RPIRoutes");

//use body parser to read POST HTTP request and JSON params
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Help backend run the static files of frontend in the same port (3000). NOT RECOMMEND for developement use
//app.use(express.static(path.join(__dirname, "dist")));

//For Cross-Origin Resource Sharing between 2 different ports
app.use(CORS.connect);

//all route /api/user/... will go to userRoutes
app.use("/api/user", userRoutes);
app.use("/api/dining", diningRoutes);
app.use("/api/rpi", rpiRoutes);
//for other unrecognized routes
app.use("*", (req, res) => {
  res.send("404 not found");
});

module.exports = app;
