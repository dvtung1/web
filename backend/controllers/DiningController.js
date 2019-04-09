/*
  Controller file that contain all the logic business for DiningCourt. Link to DiningRoutes
*/
"use strict";

const Backendless = require("../utils/db.configuration"); //initialize backendless database
const DiningTiming = require("../models/DiningTiming");
const Comment = require("../models/Comment");
const diningCourtList = require("./DiningInfo").diningCourtList;
const diningTypeList = require("./DiningInfo").diningTypeList;

//for converting EST time
const HOUR_AHEAD = 5;

/*
  Get comments along with author name and rating.
  @query name dining court name
  @query type dining timing type. Ex: breakfast, dinner
  @return json with comment text, author name, and comment rating
*/
exports.getComments = async (req, res) => {
  try {
    let diningCourtName = req.query.name;

    if (diningCourtName != null) {
      diningCourtName = diningCourtName.toLowerCase();
    }

    if (diningCourtList.indexOf(diningCourtName) === -1) {
      return res.status(500).json({
        message: "No corresponding diningCourtName is found"
      });
    }

    //if dining court is "pete's za", use objectId instead
    let whereClause = "";
    if (diningCourtName === "pete's za") {
      whereClause = `ofDiningTiming.ofPlace.objectId = '72D126B0-8BFD-82EF-FFCD-2AC4390F4F00'`;
    } else {
      whereClause = `ofDiningTiming.ofPlace.name = '${diningCourtName}'`;
    }

    let diningType = req.query.type;
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

    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
      whereClause
    );
    queryBuilder.setSortBy(["created DESC"]);

    let commentList = await Backendless.Data.of(Comment).find(queryBuilder);
    let commentListResult = []; //list of comments that will be return
    commentList.forEach(comment => {
      //push each comment onto the Result list
      commentListResult.push({
        author: comment.byUser.email,
        text: comment.text,
        rating: comment.rating,
        objectId: comment.objectId,
        authorId: comment.byUser.objectId,
        diningType: comment.ofDiningTiming.diningType.name
      });
    });
    let count = await Backendless.Data.of(Comment).getObjectCount(queryBuilder);
    return res.status(200).json({
      message: "Get posts successfully",
      comments: commentListResult,
      count: count
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Post a comment to database
 * @body inputComment a text of comment
 * @body diningCourt name of the dining court
 * @body diningType type of meal
 * @body rating TODO
 * @return JSON with comment info
 */
exports.postComment = async (req, res) => {
  try {
    let inputComment = req.body.inputComment;
    //initialize comment
    //TODO rating
    let comment = new Comment({
      text: inputComment,
      rating: 5
    });

    let diningCourt = req.body.diningCourt.toLowerCase();
    let diningType = req.body.diningType.toLowerCase();
    let whereClause = `ofPlace.name = '${diningCourt}' and diningType.name = '${diningType}'`;
    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
      whereClause
    );

    //concurrently get savedComment, currentUser, and diningTiming from database
    let [savedComment, currentUser, foundDiningTiming] = await Promise.all([
      comment.save(),
      Backendless.UserService.getCurrentUser(),
      Backendless.Data.of(DiningTiming)
        .find(queryBuilder)
        .then(foundDiningTimings => {
          if (foundDiningTimings.length == 0) {
            throw new Error("Cannot find corresponding diningTiming");
          }
          return foundDiningTimings[0];
        })
    ]);

    //After saving and getting comment objectId, set its relation to the user
    savedComment.setByUser(currentUser);
    //set relation from comment to ofDiningTiming
    savedComment.setOfDiningTiming(foundDiningTiming);

    return res.status(201).json({
      message: "add comment successfully",
      comment: {
        author: currentUser.email,
        text: savedComment.text,
        rating: savedComment.rating,
        objectId: savedComment.objectId,
        authorId: currentUser.objectId,
        diningType: diningType
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Delete a specific comment.
 * @param id id of the comment that need to be deleted
 * @return JSON with successful message
 */
exports.deleteComment = async (req, res) => {
  try {
    let id = req.params.id;
    let userObjectId = Backendless.LocalCache.get("current-user-id");

    let comment = await Backendless.Data.of(Comment).findById(id);
    //check if user is authorized to delete comment
    if (comment.byUser.objectId !== userObjectId) {
      return res.status(401).json({
        message: "Unauthorized to delete comment"
      });
    }
    await comment.remove();
    return res.status(200).json({
      message: "Delete comment successfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Edit a specific comment
 * @param id id of the comment that needs to be edited
 * @return JSON with successful message
 */
exports.editComment = async (req, res) => {
  try {
    let id = req.params.id;
    let newText = req.body.text;
    let userObjectId = Backendless.LocalCache.get("current-user-id");

    let comment = await Backendless.Data.of(Comment).findById(id);
    //check if user is authorized to edit comment
    if (comment.byUser.objectId !== userObjectId) {
      return res.status(401).json({
        message: "Unauthorized to delete comment"
      });
    }
    //edit comment text
    comment.text = newText;
    //save the change back to database
    await comment.save();
    return res.status(200).json({
      message: "Edit comment successfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Get all comments of the current user.
 * @return JSON with message and comments, which is a list of object (diningName, diningType,
 * author, text, rating, objectId, authorId)
 */
exports.getCommentsByUser = async (req, res) => {
  try {
    let userObjectId = Backendless.LocalCache.get("current-user-id");
    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
      `byUser.objectId = '${userObjectId}'`
    );
    let foundComments = await Backendless.Data.of(Comment).find(queryBuilder);
    let commentListResult = [];
    foundComments.forEach(comment => {
      commentListResult.push({
        diningName: comment.ofDiningTiming.ofPlace.name,
        diningType: comment.ofDiningTiming.diningType.name,
        author: comment.byUser.email,
        text: comment.text,
        rating: comment.rating,
        objectId: comment.objectId,
        authorId: comment.byUser.objectId
      });
    });
    return res.status(200).json({
      message: "Fetch comment of the current user successfully",
      comments: commentListResult
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Get a specific comment by id.
 * @param id id of the comment
 * @return JSON with author, text, rating, objectId, authorId, and diningType
 */
exports.getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    let foundComment = await Backendless.Data.of(Comment).findById(id);
    return res.status(200).json({
      author: foundComment.byUser.email,
      text: foundComment.text,
      rating: foundComment.rating,
      objectId: foundComment.objectId,
      authorId: foundComment.byUser.objectId,
      diningType: foundComment.ofDiningTiming.diningType.name
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

/*
 * Get all current opened dining courts (with time of opening and closing) and closed dining courts
 * @return JSON with message, openedDiningCourts, and closedDiningCourts
 */
exports.getMealTime = async (req, res) => {
  try {
    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
      whereClauseCurrentTime()
    );
    //get all current open dining courts
    let foundDiningTimings = await Backendless.Data.of(DiningTiming).find(
      queryBuilder
    );
    //contain json object, each has properties: diningName and closedTime
    let openDiningCourts = [];
    //temp list to filter out and get closed dining court
    let openDiningCourtsName = [];
    foundDiningTimings.forEach(diningTiming => {
      //convert Epoch time to EST time
      let epochTimeClosed = diningTiming.to;
      let epochTimeOpened = diningTiming.from;
      let closedTime = convertESTDateTime(new Date(parseInt(epochTimeClosed)));
      let openedTime = convertESTDateTime(new Date(parseInt(epochTimeOpened)));

      openDiningCourts.push({
        diningName: diningTiming.ofPlace.name,
        diningType: diningTiming.diningType.name,
        openedTime: openedTime,
        closedTime: closedTime
      });

      openDiningCourtsName.push(diningTiming.ofPlace.name.toLowerCase());
    });
    //get all the dining courts that are closed
    let closedDiningCourts = diningCourtList.filter(
      item => !openDiningCourtsName.includes(item)
    );

    return res.status(200).json({
      message:
        "Get current meal time (open/close) and specific closed time successfully",
      openDiningCourts: openDiningCourts,
      closedDiningCourts: closedDiningCourts
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

exports.checkOpenClosed = (req, res) => {
  //console.log("RUNNING CORRECTLY");
  var fulldate = new Date();
  var date = fulldate.toLocaleDateString();
  var timehours = fulldate.getHours();
  var timeminutes = fulldate.getMinutes();
  var timeseconds = fulldate.getSeconds();
  var time = "" + timehours + ":" + timeminutes + ":" + timeseconds;
  //console.log(date);
  //console.log(time);

  var datetime = date + " " + time;
  //console.log(datetime);

  //var opendc = []; //return array with list of open dining courts
  //var closeddc = []; //reutrn array with list of closed dining courts
  var tvdc = [];
  var queryBuilder = Backendless.DataQueryBuilder.create();
  diningCourtList.forEach(diningcourt => {
    //console.log(diningcourt);
    //72D126B0-8BFD-82EF-FFCD-2AC4390F4F00
    if (diningcourt === "pete's za") {
      var whereClause =
        "from <= '" +
        date +
        " " +
        time +
        " EST' and to > '" +
        date +
        " " +
        time +
        " EST' AND to < '" +
        date +
        " 23:59:59 EST'" +
        "and ofPlace.name = '72D126B0-8BFD-82EF-FFCD-2AC4390F4F00'";
    } else {
      var whereClause =
        "from <= '" +
        date +
        " " +
        time +
        " EST' and to > '" +
        date +
        " " +
        time +
        " EST' AND to < '" +
        date +
        " 23:59:59 EST'" +
        "and ofPlace.name = '" +
        diningcourt +
        "'";
    }
    var count = 0;
    console.log("same dining2 : " + diningcourt);
    queryBuilder.setWhereClause(whereClause);
    Backendless.Data.of(DiningTiming)
      .find(queryBuilder)
      .then(ooc => {
        console.log("same dining3 : " + diningcourt);
        if (ooc.length == 0) {
          console.log(diningcourt + " is not open");
          //closeddc.push(diningcourt);
          //console.log("closeddc: " + closeddc);
          tvdc.push(false);
          console.log(tvdc);
        } else {
          console.log(diningcourt + " is open");
          //opendc.push(diningcourt);
          //console.log("opendc: " + opendc);
          tvdc.push(true);
          console.log(tvdc);
        }
      })
      .catch(err => {
        //console.log(err);
      });
    // Have to query the database
    // using datetime to check "from" and "to" in DiningTiming Table
    // return true or false depeding if open or not right now
    // order matters
  });
  console.log("TVDC B4 return: " + tvdc);
  return res.status(200).send({
    message: "List of open and closed dining courts retreived successfully",
    //opendc: opendc,
    //closeddc: closeddc,
    tv: {
      tvdc: [false, true, true, false, true, true, false]
    }
  });
};

/*
 * Get menu of a specific dining court.
 * @param place the specific place that is in the diningCourtList array
 * @param date (OPTIONAL) with format: yyyy-mm-dd. More info in DiningRoutes
 * @return JSON with a message and menu object, which have format: diningType -> menuSections -> menuItems
 * @throws error when place is not exist, when date is in incorrect format, problem with database
 */
exports.getMenu = async (req, res) => {
  try {
    let place = req.params.place;
    //check if param place is exist
    if (diningCourtList.indexOf(place) === -1) {
      return res.status(500).json({
        message: "No corresponding diningCourtName is found"
      });
    }

    let date = req.params.date;
    if (date == null) {
      date = convertESTDateTime(new Date());
    } else {
      date = convertESTDateTime(new Date(date + ` ${HOUR_AHEAD}:00:00`));
    }

    //extract the time (hh:mm:ss) and get the date only
    let dateWOtime = date.split(" ")[0];
    let whereClause = `from >= '${dateWOtime} 00:00:00 EST' and to < '${dateWOtime} 23:59:59 EST' and ofPlace.name='${place}'`;
    let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
      whereClause
    );
    let foundDiningTimings = await Backendless.Data.of(DiningTiming).find(
      queryBuilder
    );

    let menu = {};
    for (let diningTiming of foundDiningTimings) {
      //iterate through each menu section
      let objInner = {};
      for (let menuSection of diningTiming.menuSections) {
        let menuItemList = [];
        //iterate thorugh each menu item
        for (let menuItem of menuSection.menuItems) {
          let menuItemName = menuItem.name;
          menuItemList.push(menuItemName);
        }
        //replace all space with _
        let menuSectionName = menuSection.name.replace(/ /g, "_");
        objInner[menuSectionName] = menuItemList;
      }
      //replace all space with _
      let diningType = diningTiming.diningType.name.replace(/ /g, "_");
      menu[diningType] = objInner;
    }
    return res.status(200).json({
      message: `Fetch menu of ${place} on ${dateWOtime} successfully`,
      menu
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

// var setupQueryBuilder = () => {
//   return Backendless.DataQueryBuilder.create().setWhereClause(
//     "from <= '03/21/2019 19:00:00 EST' and to > '03/21/2019 19:00:00 EST'"
//   );
// };

/*
 * Set up where clause for backendless to get the SQL clause based on current time.
 * @return whereClause string of whereClause
 */
let whereClauseCurrentTime = () => {
  let dateAndTime = convertESTDateTime(new Date());
  let whereClause =
    "from <= '" + dateAndTime + " EST' and to > '" + dateAndTime + " EST'";
  //return Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
  return whereClause;
};

/*
 * Get two didgits for each number. Ex: 8 => 08
 * @param num 1-digit or 2-digit number
 * @return a 2-digit number
 */
let getTwoDigits = num => {
  return ("0" + num).slice(-2);
};

/*
 * Convert the current UTC time to EST formated date time
 * @param today a Date object
 * @return EST formated date time: mm/dd/yyyy hh:mm:ss
 */
let convertESTDateTime = today => {
  //convert from UTC to EST time zone
  today.setHours(
    today.getHours() + today.getTimezoneOffset() / 60 - HOUR_AHEAD
  );

  let time =
    getTwoDigits(today.getHours()) + ":" + getTwoDigits(today.getMinutes());
  //date format = 03/15/2018
  let date =
    getTwoDigits(today.getMonth() + 1) +
    "/" +
    getTwoDigits(today.getDate()) +
    "/" +
    today.getFullYear();
  let str = date + " " + time + ":00";
  return str;
};
