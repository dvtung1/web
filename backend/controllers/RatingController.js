"use strict";

const Backendless = require("../utils/db.configuration"); //initialize backendless database
const DiningTiming = require("../models/DiningTiming");
const Rating = require("../models/Rating");
const diningCourtList = require("../utils/ControllerHelper").diningCourtList;
const diningTypeList = require("../utils/ControllerHelper").diningTypeList;
const convertESTDateTime = require("../utils/ControllerHelper")
  .convertESTDateTime;
const PETEZA_ID = require("../utils/ControllerHelper").PETEZA_ID;
const EXCELLENT = 3;
const SATISFACTORY = 2;
const POOR = 1;

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

  //get all ratings for ONLY today
  let date = convertESTDateTime(new Date());
  let dateWOtime = date.split(" ")[0];
  whereClause += ` and ofDiningTiming.from >= '${dateWOtime} 00:00:00 EST' and ofDiningTiming.to < '${dateWOtime} 23:59:59 EST'`;

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
    return x === EXCELLENT;
  }).length;
  let numSatisfactory = scoreArray.filter(x => {
    return x === SATISFACTORY;
  }).length;
  let numPoor = scoreArray.filter(x => {
    return x === POOR;
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

let getTrendingRatingHelper = async diningName => {
  let date = convertESTDateTime(new Date());
  let dateWOtime = date.split(" ")[0];
  let whereClause = `ofDiningTiming.ofPlace.name='${diningName}' and created > '04/19/2019 00:00:00 EST'`;
  let queryBuilder = Backendless.DataQueryBuilder.create().setProperties(
    "Avg(rating) as calc"
  );
  queryBuilder.setWhereClause(whereClause);
  let result = await Backendless.Data.of(Rating).find(queryBuilder);
  return result;
};

exports.getTrendingRating = async (req, res) => {
  try {
    let scoreArray = [];
    for (let diningCourt of diningCourtList) {
      let result = await calculateAverageRating(diningCourt, null);
      let averageScore = result[3];

      if (isNaN(averageScore)) {
        averageScore = "0";
      }
      scoreArray.push({
        diningName: diningCourt,
        averageScore
      });
    }
    //sort the array
    scoreArray.sort((a, b) => (a.averageScore < b.averageScore ? 1 : -1));

    return res.status(200).json({
      message: "Top trending dining courts",
      scoreArray
    });
    /*
    let scoreArray = [];
    for (let diningCourt of diningCourtList) {
      let whereClause = `ofDiningTiming.ofPlace.name='Ford' and created > '04/19/2019 00:00:00 EST'`;
      let queryBuilder = Backendless.DataQueryBuilder.create().setProperties(
        "Avg(rating) as calc"
      );
      queryBuilder.setWhereClause(whereClause);
      let result = await Backendless.Data.of(Rating).find(queryBuilder);
      result = JSON.stringify(result, null, 2);
      scoreArray.push({
        diningName: diningCourt,
        result
      });
    }
    //sort the array
    scoreArray.sort((a, b) => (a.averageScore < b.averageScore ? 1 : -1));

    return res.status(200).json({
      message: "Top trending dining courts",
      scoreArray
    });
    */
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
    return EXCELLENT;
  } else if (rating === "satisfactory") {
    return SATISFACTORY;
  } else if (rating === "poor") {
    return POOR;
  }
  return null;
};
