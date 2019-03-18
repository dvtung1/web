var Backendless = require("../utils/db.configuration"); //initialize backendless database
var DiningTiming = require("../models/DiningTiming");
var Rating = require("../models/Rating");

exports.postRating = (req, res) => {
  var rating = req.body.rating;
  if (rating === "excellent") {
    rating = 1;
  } else if (rating === "satisfactory") {
    rating = 2;
  } else if (rating === "poor") {
    rating = 3;
  } else {
    return res.status(500).json({
      message: "Rating message is unrecognized"
    });
  }
  var place = req.body.place;

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

setupQueryBuilder = place => {
  var today = new Date();

  //different between UTC and EST hours
  var hourAhead = 4;

  //convert from UTC to EST time zone
  today.setHours(today.getHours() + today.getTimezoneOffset() / 60 - hourAhead);
  //time format = 10:00
  var time = today.getHours() + ":" + today.getMinutes();
  //date format = 03/15/2018
  var date =
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    "/" +
    today.getFullYear();

  var whereClause =
    "from <= '" +
    date +
    " " +
    time +
    ":00 EST' and to > '" +
    date +
    " " +
    time +
    ":00 EST' AND to < '" +
    date +
    " 23:59:59 EST'" +
    "and ofPlace.name = '" +
    place +
    "'";
  return Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
};
