/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/

require("../utils/db.configuration"); //initialize backendless database
var Place = require("../models/Place");
var DiningTiming = require("../models/DiningTiming");
var Comment = require("../models/Comment");

var diningCourtId = {
  Windsor: "B291DFF7-E046-215C-FF9F-11C8A56BD100",
  Wiley: "88790C84-6521-2DEA-FF40-4D9626089C00",
  PeteZa: "661C1300-4A45-252D-FF8C-FE6F89BC2700",
  Bowl: "61088508-60C5-4F4E-FFAE-B302C12F3B00",
  Hillenbrand: "6EBE3858-7951-86E0-FFD8-F8B182302400",
  Earhart: "23394555-ACCC-C8BE-FF85-21FC323CA700",
  Ford: "DC746107-DAB6-993C-FF95-EA5339CDDB00"
};

/*
  Get comments along with author name and rating.
  @queryParam name dining court name
  @queryParam type dining timing type. Ex: breakfast, dinner
  @return json with comment text, author name, and comment rating
*/
exports.getComments = (req, res) => {
  var diningCourtName = req.query.name;
  if (!(diningCourtName in diningCourtId)) {
    console.log("wrong dining court name");
    return;
  }
  var getDiningCourtId = diningCourtId[diningCourtName];
  var commentListResult = []; //list of comments that will be return
  Backendless.Data.of(Place)
    .findById(getDiningCourtId)
    .then(function(place) {
      //get specific place
      var diningTimingsList = place.getDiningTimings();
      //iterate through the list of dining timing
      diningTimingsList.forEach(diningTiming => {
        var commentList = diningTiming.comments;
        //iterate through list of comment of each dining timing
        commentList.forEach(comment => {
          //push each comment onto the Result list
          commentListResult.push({
            author: comment.byUser.email,
            text: comment.text,
            rating: comment.rating
          });
        });
      });
      //send the comment array as json
      res.status(200).json(commentListResult);
    })
    .catch(function(error) {
      return res.status(500).json({
        message: error.message
      });
    });
};
