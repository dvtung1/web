function Place() {
  this.objectId = "";
  this.address = "";
  this.diningTimings = [];
  this.name = "";
  this.phone = "";
}

Place.prototype.getObjectId = function() {
  return this.objectId;
};

Place.prototype.setAddress = function(address) {
  this.address = address;
};

Place.prototype.getAddress = function() {
  return this.address;
};
Place.prototype.setDiningTimings = function(listDiningTimings) {
  this.diningTimings = listDiningTimings;
};
Place.prototype.getDiningTimings = function() {
  return this.diningTimings;
};
Place.prototype.setName = function(name) {
  this.name = name;
};
Place.prototype.getName = function() {
  return this.name;
};
Place.prototype.setPhone = function(number) {
  this.phone = number;
};
Place.prototype.getPhone = function() {
  return this.phone;
};

module.exports = Place;
