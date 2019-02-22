var DiningTiming = require("./DiningTiming");

function Comment() {
  this.byUser;
  this.ofDiningTiming;
  this.rating = "";
  this.text = "";
  this.objectId = "";
}
Comment.prototype.getObjectId = function() {
  return this.objectId;
};
Comment.prototype.setByUser = function(user) {
  if (user instanceof Backendless.User) {
    this.byUser = user;
  }
};

Comment.prototype.getByUser = function() {
  return this.byUser;
};

Comment.prototype.setOfDiningTiming = function(diningTiming) {
  if (diningTiming instanceof DiningTiming) {
    this.ofDiningTiming = diningTiming;
  }
};
Comment.prototype.getOfDiningTiming = function() {
  return this.ofDiningTiming;
};
Comment.prototype.setRating = function(rate) {
  this.rating = rate;
};
Comment.prototype.getRating = function() {
  return rating;
};
Comment.prototype.setText = function(text) {
  this.text = text;
};
Comment.prototype.getText = function() {
  return this.text;
};

module.exports = Comment;
