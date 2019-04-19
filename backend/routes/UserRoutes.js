/*
    File that include all the routes for User. Link to app.js
*/
"use strict";

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const userAuthentication = require("../middlewares/userAuthentication.middleware"); //middleware to check user has logged in or not

//Input route, http verb, along with controllers below
router.post("/signup", UserController.createAccount);
router.post("/login", UserController.signIn);
router.post("/recovery", UserController.recoveryPassword);
router.post("/resend", UserController.resendConfirmation);
router.post("/bug", userAuthentication, UserController.sendBug);

router.get("/checkifloggedin", UserController.checkIfUserLoggedIn);
router.get("/logout", userAuthentication, UserController.logOut);
router.get("/userinfo", userAuthentication, UserController.getCurrentUserInfo);

router.put("/password", userAuthentication, UserController.modifyPassword);
router.put("/email", userAuthentication, UserController.modifyEmail);
router.put("/username", userAuthentication, UserController.modifyUsername);

module.exports = router;
