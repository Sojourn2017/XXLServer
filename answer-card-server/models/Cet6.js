let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cetSchema = new Schema({
  en: String,
  ch: Array,
  id: Number
})

module.exports = mongoose.model('Cet6', cetSchema);