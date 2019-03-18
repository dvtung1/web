/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/

var Backendless = require("../utils/db.configuration"); //initialize backendless database
var DiningTiming = require("../models/DiningTiming");
var Comment = require("../models/Comment");

var diningCourtList = [
  "windsor",
  "wiley",
  "pete's za",
  "1bowl",
  "hillenbrand",
  "earhart",
  "ford"
];
var diningTypeList = ["breakfast", "lunch", "late lunch", "dinner"];
/*
  Get comments along with author name and rating.
  @queryParam name dining court name
  @queryParam type dining timing type. Ex: breakfast, dinner
  @return json with comment text, author name, and comment rating
*/
exports.getComments = (req, res) => {
  var diningCourtName = req.query.name;

  if (diningCourtName != null) {
    diningCourtName = diningCourtName.toLowerCase();
  }

  if (diningCourtList.indexOf(diningCourtName) === -1) {
    return res.status(500).json({
      message: "No corresponding diningCourtName is found"
    });
  }

  //if dining court is "pete's za", use objectId instead
  if (diningCourtName === "pete's za") {
    var whereClause = `ofDiningTiming.ofPlace.objectId = '72D126B0-8BFD-82EF-FFCD-2AC4390F4F00'`;
  } else {
    var whereClause = `ofDiningTiming.ofPlace.name = '${diningCourtName}'`;
  }

  var diningType = req.query.type;
  //check if diningType is not null
  if (diningType != null) {
    //check if diningTyoe is recognizable or not
    diningType = diningType.toLowerCase();
    if (diningTypeList.indexOf(diningType) === -1) {
      return res.status(500).json({
        message: "No corresponding diningType is found"
      });
    }
    whereClause += ` and ofDiningTiming.diningType.name='${diningType}'`;
  }

  var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
    whereClause
  );
  queryBuilder.setSortBy(["created DESC"]);
  var commentListResult = []; //list of comments that will be return
  Backendless.Data.of(Comment)
    .find(queryBuilder)
    .then(commentList => {
      commentList.forEach(comment => {
        //push each comment onto the Result list
        commentListResult.push({
          author: comment.byUser.email,
          text: comment.text,
          rating: comment.rating,
          objectId: comment.objectId,
          authorId: comment.byUser.objectId
        });
      });
      return res.status(200).json({
        message: "Get posts successfully",
        comments: commentListResult
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.postComment = (req, res) => {
  var inputComment = req.body.inputComment;
  var diningCourt = req.body.diningCourt.toLowerCase();
  var diningType = req.body.diningType.toLowerCase();

  //get current user
  Backendless.UserService.getCurrentUser()
    .then(currentUser => {
      var whereClause = `ofPlace.name = '${diningCourt}' and diningType.name = '${diningType}'`;
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
        whereClause
      );
      Backendless.Data.of(DiningTiming)
        .find(queryBuilder)
        .then(foundDiningTimings => {
          if (foundDiningTimings.length === 0) {
            return res.status(500).json({
              message: "Cannot find corresponding diningTiming"
            });
          }
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
              savedComment.setOfDiningTiming(foundDiningTimings[0]);

              return res.status(200).json({
                message: "add comment successfully",
                author: currentUser.email,
                text: comment.text,
                rating: comment.rating,
                objectId: comment.objectId,
                authorId: currentUser.objectId
              });
            })
            .catch(err => {
              return res.status(500).json({
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
exports.editComment = (req, res) => {
  
}
