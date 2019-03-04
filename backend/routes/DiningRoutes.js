const express = require("express");
const router = express.Router();
const DiningController = require("../controllers/DiningController");
const userAuthentication = require("../middlewares/userAuthentication.middleware");
//middleware to check user has logged in or not

router.get("/comment", DiningController.getComments);
router.post("/comment", userAuthentication, DiningController.postComment);
router.delete(
  "/comment/delete/:id",
  userAuthentication,
  DiningController.deleteComment
);
//get and post are different verbs so using the same route name is ok
//thats a useful comment @tung, thank you

module.exports = router;
