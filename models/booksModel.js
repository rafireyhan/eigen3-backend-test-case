const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const bookSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  loans_id_member: {
    type: String,
  },
  loans_date: {
    type: Date,
  },
});

autoIncrement.initialize(mongoose.connection);

bookSchema.plugin(autoIncrement.plugin, "Books");
module.exports = mongoose.model("Books", bookSchema);
