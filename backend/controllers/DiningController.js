/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/

var Backendless = require("../utils/db.configuration"); //initialize backendless database
var DiningTiming = require("../models/DiningTiming");
var Comment = require("../models/Comment");

var diningCourtList = [
  "1bowl",
  "earhart",
  "ford",
  "hillenbrand",
  "wiley",
  "windsor",
  "pete's za"
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
  Backendless.Data.of(Comment)
    .find(queryBuilder)
    .then(commentList => {
      //TODO can use mapping object instead

      var commentListResult = []; //list of comments that will be return
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
      Backendless.Data.of(Comment)
        .getObjectCount(queryBuilder)
        .then(count => {
          return res.status(200).json({
            message: "Get posts successfully",
            comments: commentListResult,
            count: count
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

exports.postComment = (req, res) => {
  var inputComment = req.body.inputComment;
  var diningCourt = req.body.diningCourt.toLowerCase();
  var diningType = req.body.diningType.toLowerCase();

  //get current user

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
          Backendless.UserService.getCurrentUser()
            .then(currentUser => {
              //After saving and getting comment objectId, set its relation to the user
              savedComment.setByUser(currentUser);
              //set relation from comment to ofDiningTiming
              savedComment.setOfDiningTiming(foundDiningTimings[0]);

              return res.status(201).json({
                message: "add comment successfully",
                comment: {
                  author: currentUser.email,
                  text: savedComment.text,
                  rating: savedComment.rating,
                  objectId: savedComment.objectId,
                  authorId: currentUser.objectId
                }
              });
            })
            //catch for user
            .catch(err => {
              return res.status(500).json({
                message: err.message
              });
            });
        })
        //catch for comment
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
};

exports.deleteComment = (req, res) => {
  var id = req.params.id;
  var userObjectId = Backendless.LocalCache.get("current-user-id");

  Backendless.Data.of(Comment)
    .findById(id)
    .then(comment => {
      //check if user is authorized to delete comment
      if (comment.byUser.objectId !== userObjectId) {
        return res.status(401).json({
          message: "Unauthorized to delete comment"
        });
      }
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
  var id = req.params.id;
  var newText = req.body.text;
  var userObjectId = Backendless.LocalCache.get("current-user-id");
  Backendless.Data.of(Comment)
    .findById(id)
    .then(comment => {
      //check if user is authorized to edit comment
      if (comment.byUser.objectId !== userObjectId) {
        return res.status(401).json({
          message: "Unauthorized to delete comment"
        });
      }
      //edit comment text
      comment.text = newText;
      //save the change back to database
      comment
        .save()
        .then(() => {
          return res.status(200).json({
            message: "Edit comment successfully"
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

//return json contain comments of the user along with info about diningCourt and diningType
exports.getCommentsByUser = (req, res) => {
  Backendless.UserService.getCurrentUser()
    .then(currentUser => {
      var commentListResult = []; //list of comments that will be return
      currentUser.comments.forEach(comment => {
        //push each comment onto the Result list
        commentListResult.push({
          diningName: comment.ofDiningTiming.ofPlace.name,
          diningType: comment.ofDiningTiming.diningType.name,
          comment: {
            author: currentUser.email,
            text: comment.text,
            rating: comment.rating,
            objectId: comment.objectId,
            authorId: currentUser.objectId
          }
        });
      });
      return res.status(200).json({
        message: "Fetch comment of the current user successfully",
        comments: commentListResult
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.getCommentById = (req, res) => {
  const id = req.params.id;
  Backendless.Data.of(Comment)
    .findById(id)
    .then(foundComment => {
      return res.status(200).json({
        author: foundComment.byUser.email,
        text: foundComment.text,
        rating: foundComment.rating,
        objectId: foundComment.objectId,
        authorId: foundComment.byUser.objectId
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      });
    });
};

exports.getMealTime = (req, res) => {};

exports.checkOpenClosed = (req, res) => {
  console.log("RUNNING CORRECTLY");
  var fulldate = new Date();
  var date = fulldate.toLocaleDateString();
  var timehours = fulldate.getHours();
  var timeminutes = fulldate.getMinutes();
  var timeseconds = fulldate.getSeconds();
  var time = "" + timehours + ":" + timeminutes + ":" + timeseconds;
  //console.log(date);
  //console.log(time);

  var datetime = date + " " + time;
  console.log(datetime);

  var opendc = []; //return array with list of open dining courts
  var closeddc = []; //reutrn array with list of closed dining courts
  var queryBuilder = Backendless.DataQueryBuilder.create();
  diningCourtList.forEach(diningcourt => {
    console.log(diningcourt);
    //72D126B0-8BFD-82EF-FFCD-2AC4390F4F00
    if(diningcourt === "pete's za"){
      var whereClause = "from <= '" + date + " " + time + " EST' and to > '" + date + " " + time + " EST' AND to < '" + date
      + " 23:59:59 EST'" + "and ofPlace.name = '72D126B0-8BFD-82EF-FFCD-2AC4390F4F00'";
    }
    else{
      var whereClause = "from <= '" + date + " " + time + " EST' and to > '" + date + " " + time + " EST' AND to < '" + date
      + " 23:59:59 EST'" + "and ofPlace.name = '" + diningcourt + "'";
    }
    var count = 0;
    queryBuilder.setWhereClause(whereClause);
    Backendless.Data.of(DiningTiming).
    find(queryBuilder).
    then(ooc => {
      if(ooc.length == 0){
        console.log(diningcourt + " is not open");
        closeddc.push(diningcourt);
        console.log("closeddc: " + closeddc);
      }
      else {
        console.log(diningcourt + " is open");
        opendc.push(diningcourt);
        console.log("opendc: " + opendc);
      }
    })
    .catch(err => {
      console.log(err);
    });
    // Have to query the database
    // using datetime to check "from" and "to" in DiningTiming Table
    // return true or false depeding if open or not right now
    // order matters
  });
};
