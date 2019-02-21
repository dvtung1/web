class User {
  constructor() {
    this._email = "";
    this._password = "";
    this._username = "";
  }
  set email(email) {
    if (typeof email === "string") {
      this._email = email;
    } else {
      return "invalid input";
    }
  }
  get email() {
    return this._email;
  }
  set password(password) {
    if (typeof password === "string") {
      this._password = password;
    } else {
      return "invalid input";
    }
  }
  get password() {
    return this._password;
  }
  set username(username) {
    if (typeof username === "string") {
      this._username = username;
    } else {
      return "invalid input";
    }
  }
  get username() {
    return this._username;
  }
}

module.exports = User;
