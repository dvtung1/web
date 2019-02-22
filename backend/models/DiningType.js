function DiningType() {
  this.diningTimings = [];
  this.name = "";
  this.objectId;
}

DiningType.prototype.getObjectId = function() {
  return this.objectId;
};

DiningType.prototype.setName = function(name) {
  this.name = name;
};

DiningType.prototype.getName = function() {
  return this.name;
};

DiningType.prototype.setDiningTimings = function(listDiningTimings) {
  this.diningTimings = listDiningTimings;
};

DiningType.prototype.getDiningTimings = function() {
  return this.diningTimings;
};

module.exports = DiningType;
