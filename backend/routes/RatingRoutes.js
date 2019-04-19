"use strict";

const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/RatingController");

router.get("/trending", RatingController.getTrendingRating);
router.get("/:diningName", RatingController.getRating);
router.get("/:diningName/average", RatingController.getAverageRating);
router.post("", RatingController.postRating);

module.exports = router;
