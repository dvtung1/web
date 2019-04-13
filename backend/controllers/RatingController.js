"use strict";

const Backendless = require("../utils/db.configuration"); //initialize backendless database
const DiningTiming = require("../models/DiningTiming");
const Rating = require("../models/Rating");
const diningCourtList = require("../utils/ControllerHelper").diningCourtList;
const diningTypeList = require("../utils/ControllerHelper").diningTypeList;
const convertESTDateTime = require("../utils/ControllerHelper")
  .convertESTDateTime;
const PETEZA_ID = require("../utils/ControllerHelper").PETEZA_ID;

/*
 * Query ratings based on dining court.
 * @param diningName name of the dining court
 * @query type (OPTIONAL) diningType such as breakfast
 */
exports.getRating = async (req, res) => {
  try {
    let diningName = req.params.diningName.toLowerCase();
    let diningType = req.query.type;

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
