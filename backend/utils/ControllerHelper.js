//for converting EST time
const Rating = require("../models/Rating");
const HOUR_AHEAD = 5;
exports.HOUR_AHEAD;
//Pete's za backendless ObjectID
exports.PETEZA_ID = "98648DA5-C244-DC76-FF11-CA1DE1609100";

let diningCourtList = [
  "1bowl",
  "earhart",
  "ford",
  "hillenbrand",
  "wiley",
  "windsor",
  "pete's za"
];
exports.diningCourtList = [
  "1bowl",
  "earhart",
  "ford",
  "hillenbrand",
  "wiley",
  "windsor",
  "pete's za"
];
let diningTypeList = ["breakfast", "lunch", "late lunch", "dinner"];
exports.diningTypeList = ["breakfast", "lunch", "late lunch", "dinner"];

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
exports.convertESTDateTime = today => {
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

let getRatingHelper = async (diningName, diningType) => {
  if (diningCourtList.indexOf(diningName.toLowerCase()) === -1) {
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

exports.calculateAverageRating = async (diningName, diningType) => {
  let ratings = await getRatingHelper(diningName, diningType);
  let scoreArray = [];
  for (let rating of ratings) {
    scoreArray.push(rating.score);
  }
  let numExcellent = scoreArray.filter(x => {
    return x === 5;
  }).length;
  let numSatisfactory = scoreArray.filter(x => {
    return x === 3;
  }).length;
  let numPoor = scoreArray.filter(x => {
    return x === 1;
  }).length;

  //calculate the mean score and format it to 2 digit float
  let averageScore = (
    scoreArray.reduce((total, c) => total + c, 0) /
    parseFloat(scoreArray.length)
  ).toFixed(2);

  return [numExcellent, numSatisfactory, numPoor, averageScore];
};
