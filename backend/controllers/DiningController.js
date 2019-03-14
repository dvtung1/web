/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/

var Backendless = require("../utils/db.configuration"); //initialize backendless database
var Place = require("../models/Place");
var DiningTiming = require("../models/DiningTiming");
var Comment = require("../models/Comment");

var diningCourtId = {
  windsor: "B291DFF7-E046-215C-FF9F-11C8A56BD100",
  wiley: "88790C84-6521-2DEA-FF40-4D9626089C00",
  peteza: "661C1300-4A45-252D-FF8C-FE6F89BC2700",
  onebowl: "61088508-60C5-4F4E-FFAE-B302C12F3B00",
  hillenbrand: "6EBE3858-7951-86E0-FFD8-F8B182302400",
  earhart: "23394555-ACCC-C8BE-FF85-21FC323CA700",
  ford: "DC746107-DAB6-993C-FF95-EA5339CDDB00"
};

/*
  Get comments along with author name and rating.
  @queryParam name dining court name
  @queryParam type dining timing type. Ex: breakfast, dinner
  @return json with comment text, author name, and comment rating
*/
exports.getComments = (req, res) => {
  var diningCourtName = req.query.name.toLowerCase();

  //if diningCourtName not exist, return 404
  if (!(diningCourtName in diningCourtId)) {
    return res.status(404).json({
      message: "diningCourt not recognized"
    });
  }
  var commentListResult = []; //list of comments that will be return
  Backendless.Data.of(Place)
    .findById(diningCourtId[diningCourtName])
    .then(place => {
      //get specific place
      var diningTimingsList = place.diningTimings;
      //iterate through the list of dining timing
      diningTimingsList.forEach(diningTiming => {
        var commentList = diningTiming.comments;
        //iterate through list of comment of each dining timing
        commentList.forEach(comment => {
          //push each comment onto the Result list
          commentListResult.push({
            //author: comment.byUser.email,
            author: comment.byUser.email,
            text: comment.text,
            rating: comment.rating,
            objectId: comment.objectId,
            authorId: comment.byUser.objectId
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

exports.postComment = (req, res) => {
  var inputComment = req.body.inputComment;
  var diningCourt = req.body.diningCourt;

  //get current user
  Backendless.UserService.getCurrentUser()
    .then(currentUser => {
      //get random diningTiming --- will fix later
      Backendless.Data.of(DiningTiming)
        .findFirst()
        .then(ofDiningTiming => {
          //get specific dining court name
          Backendless.Data.of(Place)
            .findById(diningCourtId[diningCourt])
            .then(place => {
              //set relationship between the diningTiming and the Place
              place.addDiningTimings(ofDiningTiming);

              //initialize comment
              var comment = new Comment({
                text: inputComment,
                rating: 5
              });

              //Save that comment to the database
              comment
                .save()
                .then(savedComment => {
                  //After saving and getting comment objectId, set its relation to the user
                  savedComment.setByUser(currentUser);
                  //set relation from comment to ofDiningTiming
                  savedComment.setOfDiningTiming(ofDiningTiming);

                  return res.status(200).json({
                    message: "add comment successfully"
                  });
                })
                .catch(err => {
                  return res.status(500).json({
                    message: err.message
                  });
                });
            })
            //catch for Place
            .catch(err => {
              res.status(500).json({
                message: err.message
              });
            });
        })
        //catch for DiningTiming
        .catch(err => {
          return res.status(500).json({
            message: err.message
          });
        });
    })
    //catch for user
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};
exports.deleteComment = (req, res) => {
  var id = req.params.id;
  Backendless.Data.of(Comment)
    .findById(id)
    .then(comment => {
      comment
        .remove()
        .then(respond => {
          return res.status(200).json({
            message: "Delete comment successfully"
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
