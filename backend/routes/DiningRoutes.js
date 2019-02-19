const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const userAuthentication = require("../middlewares/userAuthentication.middleware"); //middleware to check user has logged in or not

module.exports = router;
