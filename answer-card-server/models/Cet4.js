let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cetSchema = new Schema({
  char: String,
  charIndex: Number,
  wordsLength: Number,
  words: [
    {
      en: String,
      ch: Array,
      id: String,
      wordIndex: Number,
      wordType: String
    }
  ]
})

module.exports = mongoose.model('Cet4', cetSchema);