var Rating = require("../models/Rating");

class DiningTiming {
  constructor(args) {
    args = args || {};
    this.from = args.from || null;
    this.to = args.to || null;
    this.comments;
    this.diningType;
    this.menuSections;
    this.ofPlace;
    this.ratings;
    this.objectId;
  }
  //save instance to database
  save() {
    return Backendless.Data.of(DiningTiming).save(this);
  }

  //remove current instance from database
  remove() {
    return Backendless.Data.of(DiningTiming).remove(this);
  }

  //1-many
  addRatings(rating) {
    Backendless.Data.of(DiningTiming).addRelation(this, "ratings", [rating]);
    Backendless.Data.of(Rating).setRelation(rating, "ofDiningTiming", [this]);
  }
}
module.exports = DiningTiming;
