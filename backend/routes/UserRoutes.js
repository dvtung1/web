/*
    File that include all the routes for User. Link to app.js
*/

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const userAuthentication = require("../middlewares/userAuthentication.middleware"); //middleware to check user has logged in or not

//Input route, http verb, along with controllers below
router.post("/signup", UserController.createAccount);
router.post("/login", UserController.signIn);
router.post("/recovery", UserController.recoveryPassword);
router.post("/resend", UserController.resendConfirmation);
router.post("/modifyemail", UserController.modifyEmail);
router.post("/modifypassword", UserController.modifyPassword);
router.get("/checkifloggedin", UserController.checkIfUserLoggedIn);
router.post("/logout", UserController.logOut);

module.exports = router;
