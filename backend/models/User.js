function User() {
  this.email = "";
  this.password = "";
}

User.prototype.setEmail = function(email) {
  this.email = email;
};
User.prototype.getEmail = function() {
  return this.email;
};
User.prototype.setPassword = function(password) {
  this.password = password;
};
User.prototype.getPassword = function() {
  return this.password;
};
module.exports = User;
