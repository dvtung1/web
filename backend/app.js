const express = require("express");
const userRoutes = require("./routes/UserRoutes");
const app = express();
const path = require("path");

//Help backend run the static files of frontend in the same port (3000). NOT RECOMMEND for developement use
//app.use(express.static(path.join(__dirname, "dist")));

//all /api/user/... will go to userRoutes
app.use("/api/user", userRoutes);

module.exports = app;
