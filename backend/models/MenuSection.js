function MenuSection() {
  this.menuItems = [];
  this.name = "";
  this.objectId = "";
}

MenuSection.prototype.getObjectId = function() {
  return this.objectId;
};
MenuSection.prototype.setMenuItems = function(listMenuItems) {
  this.menuItems = listMenuItems;
};
MenuSection.prototype.getMenuItems = function() {
  return this.menuItems;
};
MenuSection.prototype.setName = function(name) {
  this.name = name;
};
MenuSection.prototype.getName = function() {
  return this.name;
};

module.exports = MenuSection;
