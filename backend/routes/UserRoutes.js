/*
    File that include all the routes for User. Link to app.js
*/

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

//Input route, http verb, along with controllers below

//route /signup will execute createAccount method
router.post("/signup", UserController.createAccount);
router.post("/login", UserController.signIn);

module.exports = router;
