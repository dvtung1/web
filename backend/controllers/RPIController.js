"use strict";

var Backendless = require("../utils/db.configuration"); //initialize backendless database
var DiningTiming = require("../models/DiningTiming");
var Rating = require("../models/Rating");

var diningCourtList = [
  "windsor",
  "wiley",
  "pete's za",
  "1bowl",
  "hillenbrand",
  "earhart",
  "ford"
];

exports.getRating = (req, res) => {
  var diningName = req.params.diningName;
  var diningType = req.query.type;
  //get rating from a particular dining court
  var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
    `ofDiningTimings.ofPlace.name='${diningName}'`
  );
  //if there is a query diningtype, search for that
  if (diningType != null) {
    queryBuilder += ` and ofDiningTimings.diningType.name='${diningType}'`;
  }
  Backendless.Data.of(Rating)
    .find(queryBuilder)
    .then(foundRatings => {
      //TODO
    });
};

exports.postRating = (req, res) => {
  var rating = req.body.rating;
  //convert rating from string to int
  rating = convertScoreInt(rating);
  if (rating == null) {
    return res.status(500).json({
      message: "Rating message is unrecognized"
    });
  }

  var place = req.body.place;
  if (place != null) {
    place = place.toLowerCase();
  }
  if (diningCourtList.indexOf(place) === -1) {
    return res.status(500).json({
      message: "No corresponding diningCourtName is found"
    });
  }

  var queryBuilder = setupQueryBuilder(place);

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

var setupQueryBuilder = place => {
  var today = new Date();
  var dateAndTime = convertESTDateTime(today);

  var whereClause =
    "from <= '" + dateAndTime + " EST' and to > '" + dateAndTime + " EST'";
  if (place === "pete's za") {
    whereClause +=
      " and ofPlace.objectId='72D126B0-8BFD-82EF-FFCD-2AC4390F4F00'";
  } else {
    whereClause += ` and ofPlace.name='${place}'`;
  }
  console.log(whereClause);
  return Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
};

var convertScoreInt = rating => {
  if (rating === "excellent") {
    return 3;
  } else if (rating === "satisfactory") {
    return 2;
  } else if (rating === "poor") {
    return 1;
  }
  return null;
};

var getTwoDigits = num => {
  return ("0" + num).slice(-2);
};

var convertESTDateTime = today => {
  var hourAhead = 5;

  //convert from UTC to EST time zone
  today.setHours(today.getHours() + today.getTimezoneOffset() / 60 - hourAhead);

  var time =
    getTwoDigits(today.getHours()) + ":" + getTwoDigits(today.getMinutes());
  //date format = 03/15/2018
  var date =
    getTwoDigits(today.getMonth() + 1) +
    "/" +
    getTwoDigits(today.getDate()) +
    "/" +
    today.getFullYear();
  var str = date + " " + time + ":00";
  return str;
};
