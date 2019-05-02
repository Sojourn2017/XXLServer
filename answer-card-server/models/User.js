let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  openid: String,
  nickName: String,
  avatarUrl: String,
  gender: Number,
  answerWords: [
    {
      en: String,
      ch: Array,
      id: String,
      wordIndex: Number,
      answerStatus: Number,
      timeStamp: Number,
      wordType: String
    }
  ],
  wrongWords: [
    {
      en: String,
      ch: Array,
      id: String,
      wordIndex: Number,
      timeStamp: Number,
      wordType: String
    }
  ]
})

module.exports = mongoose.model('Users', userSchema);