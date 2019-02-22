const express = require("express");
const router = express.Router();
const DiningController = require("../controllers/DiningController");
const userAuthentication = require("../middlewares/userAuthentication.middleware"); //middleware to check user has logged in or not

router.get("/comment", DiningController.getComments);
router.post("/postcomment", DiningController.postComment);

module.exports = router;
