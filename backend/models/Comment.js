var Backendless = require("../utils/db.configuration");
var DiningTiming = require("../models/DiningTiming");
class Comment {
  constructor(args) {
    args = args || {};
    this.rating = args.rating || null;
    this.text = args.text || null;
    this.ofDiningTiming;
    this.byUser;
    this.objectId;
    this.likes;
  }

  //save instance to database
  save() {
    return Backendless.Data.of(Comment).save(this);
  }

  //remove current instance from database
  remove() {
    return Backendless.Data.of(Comment).remove(this);
  }

  //many-1
  setByUser(currentUser) {
    //After saving and getting comment objectId, set its relation to the user
    Backendless.Data.of(Comment).setRelation(this, "byUser", [currentUser]);
    //set back relation from user to comment
    Backendless.Data.of(Backendless.User).addRelation(currentUser, "comments", [
      this
    ]);
  }
  //many-1
  setOfDiningTiming(ofDiningTiming) {
    //set relation from comment to ofDiningTiming
    Backendless.Data.of(Comment).setRelation(this, "ofDiningTiming", [
      ofDiningTiming
    ]);
    //set back relation from diningTiming to comment
    Backendless.Data.of(DiningTiming).addRelation(ofDiningTiming, "comments", [
      this
    ]);
  }
  async setLikesByUser() {
    let currentUser = await Backendless.UserService.getCurrentUser();
    Backendless.Data.of(Comment).addRelation(this, "likes", [currentUser]);
  }
  checkUserLike() {
    var userObjectId = Backendless.LocalCache.get("current-user-id");
    let listUserLikes = this.likes;
    return listUserLikes.some(element => {
      return element.objectId === userObjectId;
    });
  }
}

module.exports = Comment;
