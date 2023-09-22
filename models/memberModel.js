const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const memberSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  penalty_date: {
    type: Date,
  },
});

autoIncrement.initialize(mongoose.connection);

memberSchema.plugin(autoIncrement.plugin, "Members");
module.exports = mongoose.model("Members", memberSchema);
