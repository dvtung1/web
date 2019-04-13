"use strict";

const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/RatingController");

router.get("/:diningName", RatingController.getRating);
router.post("/", RatingController.postRating);

module.exports = router;
