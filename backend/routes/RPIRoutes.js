"use strict";

const express = require("express");
const router = express.Router();
const RPIController = require("../controllers/RPIController");

router.post("", RPIController.postRating);

module.exports = router;
