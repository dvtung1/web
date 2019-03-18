var DiningTiming = require("../models/DiningTiming");
class Place {
  constructor(args) {
    args = args || {};
    this.address = args.address || null;
    this.name = args.name || null;
    this.phone = args.phone || null;
    this.diningTimings;
    this.objectId;
  }
  //save instance to database
  save() {
    return Backendless.Data.of(Place).save(this);
  }

  //remove current instance from database
  remove() {
    return Backendless.Data.of(Place).remove(this);
  }

  //1-many
  addDiningTimings(ofDiningTiming) {
    Backendless.Data.of(Place).addRelation(this, "diningTimings", [
      ofDiningTiming
    ]);
    Backendless.Data.of(DiningTiming).setRelation(ofDiningTiming, "ofPlace", [
      this
    ]);
  }
}

module.exports = Place;
