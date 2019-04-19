"use strict";

const Backendless = require("../utils/db.configuration"); //initialize backendless database
const DiningTiming = require("../models/DiningTiming");
const Rating = require("../models/Rating");
const diningCourtList = require("../utils/ControllerHelper").diningCourtList;
const diningTypeList = require("../utils/ControllerHelper").diningTypeList;
const convertESTDateTime = require("../utils/ControllerHelper")
  .convertESTDateTime;
const PETEZA_ID = require("../utils/ControllerHelper").PETEZA_ID;

let getRatingHelper = async (diningName, diningType) => {
  if (diningCourtList.indexOf(diningName) === -1) {
    throw new Error("No corresponding diningCourt is found");
  }

  //get rating from a particular dining court
  let whereClause = "";
  if (diningName === "pete's za") {
    whereClause = `ofDiningTiming.ofPlace.objectId='${PETEZA_ID}'`;
  } else {
    whereClause = `ofDiningTiming.ofPlace.name='${diningName}'`;
  }

  //if there is a query diningtype, search for that
  if (diningType != null) {
    diningType = diningType.toLowerCase();
    if (diningTypeList.indexOf(diningType) === -1) {
      throw new Error("No corresponding diningType is found");
    }
    whereClause += ` and ofDiningTiming.diningType.name='${diningType}'`;
  }
  let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
    whereClause
  );

  let foundRatings = await Backendless.Data.of(Rating).find(queryBuilder);
  let ratings = foundRatings.map(rating => {
    return {
      score: rating.rating,
      diningType: rating.ofDiningTiming.diningType.name
    };
  });
  return ratings;
};

/*
 * Query ratings based on dining court.
 * @param diningName name of the dining court
 * @query type (OPTIONAL) diningType such as breakfast
 */
exports.getRating = async (req, res) => {
  try {
    let diningName = req.params.diningName.toLowerCase();
    let diningType = req.query.type;
    let ratings = await getRatingHelper(diningName, diningType);
    return res.status(200).json({
      message: `Fetch rating of ${diningName} successfully`,
      ratings
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

let calculateAverageRating = async (diningName, diningType) => {
  let ratings = await getRatingHelper(diningName, diningType);
  let scoreArray = [];
  for (let rating of ratings) {
    scoreArray.push(rating.score);
  }
  let numExcellent = scoreArray.filter(x => {
    return x === 3;
  }).length;
  let numSatisfactory = scoreArray.filter(x => {
    return x === 2;
  }).length;
  let numPoor = scoreArray.filter(x => {
    return x === 1;
  }).length;

  //calculate the mean score and format it to 2 digit float
  let averageScore = (
    scoreArray.reduce((total, c) => total + c, 0) /
    parseFloat(scoreArray.length)
  ).toFixed(2);

  return [numExcellent, numSatisfactory, numPoor, averageScore];
};

exports.getAverageRating = async (req, res) => {
  try {
    let diningName = req.params.diningName.toLowerCase();
    let [
      numExcellent,
      numSatisfactory,
      numPoor,
      averageScore
    ] = await calculateAverageRating(diningName, null);

    return res.status(200).json({
      message: "Get average rating successfully",
      ratings: {
        numExcellent,
        numSatisfactory,
        numPoor,
        averageScore
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

exports.getTrendingRating = async (req, res) => {
  try {
    let scoreArray = [];
    for (let diningCourt of diningCourtList) {
      let result = await calculateAverageRating(diningCourt, null);
      let averageScore = result[3];
      scoreArray.push({
        diningName: diningCourt,
        averageScore
      });
    }
    return res.status(200).json({
      message: "Top trending dining courts",
      scoreArray
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/**
 * @body rating REQUIRED
 * @body place REQUIRED
 */
exports.postRating = (req, res) => {
  let rating = req.body.rating;
  //convert rating from string to int
  rating = convertScoreInt(rating);
  if (rating == null) {
    return res.status(500).json({
      message: "Rating message is unrecognized"
    });
  }

  let place = req.body.place;
  if (place != null) {
    place = place.toLowerCase();
  }
  if (diningCourtList.indexOf(place) === -1) {
    return res.status(500).json({
      message: "No corresponding diningCourtName is found"
    });
  }

  let whereClause = whereClauseCurrentTime(place);
  let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
    whereClause
  );

  Backendless.Data.of(DiningTiming)
    .find(queryBuilder)
    .then(foundDiningTimings => {
      //return error if none of the diningcourt is opened
      if (foundDiningTimings.length === 0) {
        return res.status(500).json({
          message: "Place is closed"
        });
      }
      //create a new rating object
      var ratingObj = new Rating({
        rating: rating
      });

      //save the rating object to the database and add relation
      ratingObj
        .save()
        .then(savedRatingObj => {
          savedRatingObj.setOfDiningTiming(foundDiningTimings[0]);
          return res.status(200).json({
            message: "Save rating from RPI successfully"
          });
        })
        .catch(err => {
          return res.status(500).json({
            message: err.message
          });
        });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

let whereClauseCurrentTime = place => {
  let dateAndTime = convertESTDateTime(new Date());

  let whereClause =
    "from <= '" + dateAndTime + " EST' and to > '" + dateAndTime + " EST'";
  if (place === "pete's za") {
    whereClause += ` and ofPlace.objectId='${PETEZA_ID}'`;
  } else {
    whereClause += ` and ofPlace.name='${place}'`;
  }
  return whereClause;
};

let convertScoreInt = rating => {
  if (rating === "excellent") {
    return 3;
  } else if (rating === "satisfactory") {
    return 2;
  } else if (rating === "poor") {
    return 1;
  }
  return null;
};
