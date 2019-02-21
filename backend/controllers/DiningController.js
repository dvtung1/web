/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/

require("../utils/db.configuration"); //initialize backendless database
var Place = require("../models/Place");

var diningCourtId = {
  Windsor: "253B551A-EB21-0F8E-FF4B-22F2CB4EE600",
  Wiley: "88790C84-6521-2DEA-FF40-4D9626089C00",
  PeteZa: "661C1300-4A45-252D-FF8C-FE6F89BC2700",
  Bowl: "61088508-60C5-4F4E-FFAE-B302C12F3B00",
  Hillenbrand: "6EBE3858-7951-86E0-FFD8-F8B182302400",
  Earhart: "23394555-ACCC-C8BE-FF85-21FC323CA700",
  Ford: "DC746107-DAB6-993C-FF95-EA5339CDDB00"
};

exports.getComments = (req, res) => {
  var diningCourtName = req.query.name;
  var getDiningCourtId = diningCourtId[diningCourtName];
  var commentListResult = [];
  Backendless.Data.of(Place)
    .findById(getDiningCourtId)
    .then(function(place) {
      //get specific place
      var diningTimingsList = place.getDiningTimings();
      //iterate through the list of dining timing
      diningTimingsList.forEach(diningTiming => {
        commentList = diningTiming.getComments();
        //iterate through list of comment of each dining timing
        commentList.forEach(comment => {
          //push each comment onto the Result list
          commentListResult.push(comment);
        });
      });
      //TODO continue
    })
    .catch(function(error) {
      return res.status(500).json({
        message: "Fail to query"
      });
    });
};
