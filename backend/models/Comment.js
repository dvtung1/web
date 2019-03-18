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
  }

  //save instance to database
  save(){
    return Backendless.Data.of(Comment).save(this);
  }

  //remove current instance from database
  remove(){
    return Backendless.Data.of(Comment).remove(this);
  }

  setByUser(currentUser){
   //After saving and getting comment objectId, set its relation to the user
      Backendless.Data.of(Comment).setRelation(this, "byUser", [currentUser]);
      //set back relation from user to comment
      Backendless.Data.of(Backendless.User).addRelation(currentUser, "comments", [this]);
  }

  setOfDiningTiming(ofDiningTiming){
    //set relation from comment to ofDiningTiming
    Backendless.Data.of(Comment).setRelation(this, "ofDiningTiming", [ofDiningTiming]);
    //set back relation from diningTiming to comment
    Backendless.Data.of(DiningTiming).addRelation(ofDiningTiming, "comments", [this]);
  }
}

module.exports = Comment;
