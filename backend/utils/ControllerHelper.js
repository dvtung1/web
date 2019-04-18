//for converting EST time
const HOUR_AHEAD = 5;
exports.HOUR_AHEAD;
//Pete's za backendless ObjectID
exports.PETEZA_ID = "98648DA5-C244-DC76-FF11-CA1DE1609100";

exports.diningCourtList = [
  "1bowl",
  "earhart",
  "ford",
  "hillenbrand",
  "wiley",
  "windsor",
  "pete's za"
];
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
