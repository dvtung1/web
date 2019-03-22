const express = require("express");
const router = express.Router();
const DiningController = require("../controllers/DiningController");
const userAuthentication = require("../middlewares/userAuthentication.middleware");
//middleware to check user has logged in or not

router.get("/comment", DiningController.getComments);
router.post("/comment", userAuthentication, DiningController.postComment);
router.delete(
  "/comment/:id",
  userAuthentication,
  DiningController.deleteComment
);
router.put("/comment/:id", userAuthentication, DiningController.editComment);
router.get(
  "/comment/user",
  userAuthentication,
  DiningController.getCommentsByUser
);
router.get("/comment/:id", DiningController.getCommentById);

router.get("/mealtime", DiningController.getMealTime);

// check to see which dining courts are open or closed
router.get("/checkOpenClosed", DiningController.checkOpenClosed);

module.exports = router;
