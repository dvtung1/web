var Backendless = require("../utils/db.configuration");
var DiningTiming = require("../models/DiningTiming");

class Rating {
  constructor(args) {
    args = args || {};
    this.rating = args.rating || null;
    this.ofDiningTiming;
    this.objectId;
  }
  //save instance to database
  save() {
    return Backendless.Data.of(Rating).save(this);
  }

  //remove current instance from database
  remove() {
    return Backendless.Data.of(Rating).remove(this);
  }

  setOfDiningTiming(ofDiningTiming) {
    Backendless.Data.of(Rating).setRelation(this, "ofDiningTiming", [
      ofDiningTiming
    ]);
    Backendless.Data.of(DiningTiming).addRelation(ofDiningTiming, "ratings", [
      this
    ]);
  }
}

module.exports = Rating;
