/*
    File that include all the routes for User. Link to app.js
*/

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const userAuthentication = require("../middlewares/userAuthentication.middleware");
//Input route, http verb, along with controllers below

//route /signup will execute createAccount method
router.post("/signup", UserController.createAccount);
router.post("/login", UserController.signIn);
router.post("/recovery", UserController.recoveryPassword);
router.post("/resend", UserController.resendConfirmation);
router.get("/logout", UserController.logOut);

module.exports = router;
