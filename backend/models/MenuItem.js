function MenuItem() {
  this.allergens = "";
  this.name = "";
  this.objectId;
}

MenuItem.prototype.getObjectId = function() {
  return this.objectId;
};
MenuItem.prototype.setName = function(name) {
  this.name = name;
};
MenuItem.prototype.getName = function() {
  return this.name;
};
MenuItem.prototype.setAllergens = function(allergens) {
  this.allergens = allergens;
};
MenuItem.prototype.getAllergens = function() {
  return this.allergens;
};

module.exports = MenuItem;
