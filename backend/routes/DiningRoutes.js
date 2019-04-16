"use strict";
const express = require("express");
const router = express.Router();
const DiningController = require("../controllers/DiningController");
//const RatingController = require("../controllers/RatingController");
const userAuthentication = require("../middlewares/userAuthentication.middleware");
//middleware to check user has logged in or not

router.get("/comment", DiningController.getComments);
router.post("/comment", userAuthentication, DiningController.postComment);
router.delete(
  "/comment/:id",
  userAuthentication,
  DiningController.deleteComment
);
router.patch("/comment/:id", userAuthentication, DiningController.editComment);
router.get(
  "/comment/user",
  userAuthentication,
  DiningController.getCommentsByUser
);
router.get("/comment/:id", DiningController.getCommentById);

router.get("/mealtime", DiningController.getMealTime);

//route will get the current (real-time) menu
router.get("/menu/:place", DiningController.getMenu);
//get a specific date menu
router.get("/menu/:place/:date", DiningController.getMenu);

// check to see which dining courts are open or closed
router.get("/checkOpenClosed", DiningController.checkOpenClosed);

//update like data to backend
router.post("/like/:id", userAuthentication, DiningController.postLikeComment);

module.exports = router;
