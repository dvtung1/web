const express = require("express");
const router = express.Router();
const DiningController = require("../controllers/DiningController");
const userAuthentication = require("../middlewares/userAuthentication.middleware"); //middleware to check user has logged in or not

router.get("/comment", DiningController.getComments);
router.post("/comment", DiningController.postComment);
//get and post are different verbs so using the same route name is ok

module.exports = router;
