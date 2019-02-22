var DiningType = require("./DiningType");
var Place = require("./Place");

function DiningTiming() {
  this.comments = [];
  this.diningType;
  this.menu = [];
  this.ofPlace;
  this.ratings = [];
  this.objectId;
}
DiningTiming.prototype.getObjectId = function() {
  return this.objectId;
};
DiningTiming.prototype.setComments = function(listComments) {
  this.comments = listComments;
};
DiningTiming.prototype.getComments = function() {
  return this.comments;
};
DiningTiming.prototype.setDiningType = function(diningType) {
  if (diningType instanceof DiningType) {
    this.diningType = diningType;
  }
};
DiningTiming.prototype.getDiningType = function() {
  return this.diningType;
};
DiningTiming.prototype.setMenu = function(listMenu) {
  this.menu = listMenu;
};
DiningTiming.prototype.getMenu = function() {
  return this.menu;
};
DiningTiming.prototype.setOfPlace = function(place) {
  if (place instanceof Place) {
    this.ofPlace = place;
  }
};
DiningTiming.prototype.getOfPlace = function() {
  return this.ofPlace;
};
DiningTiming.prototype.setRatings = function(listRatings) {
  this.ratings = listRatings;
};
DiningTiming.prototype.getRatings = function() {
  return this.ratings;
};
module.exports = DiningTiming;
