User.create([{
  openid: "test",
  nickName: "Sojourn",
  avatarUrl: "",
  gender: 1,
  answerWords: [
    {
      "en": "badge",
      "ch": ["n.徽章，像章；标志"],
      "id": "6B4",
      "wordIndex": 4,
      "wordType": "cet6",
      answerStatus: 1,
      timeStamp: 1556428111863
    },
    {
      "en": "fluctuation",
      "ch": ["n.波动；脉动；踌躇"],
      "id": "6F53",
      "wordIndex": 53,
      "wordType": "cet6",
      answerStatus: 0,
      timeStamp: 1556172020000
    },
    {
      "en": "overlap",
      "ch": ["vt.与…交搭", "vi.重迭"],
      "id": "6O51",
      "wordIndex": 51,
      "wordType": "cet6",
      answerStatus: 0,
      timeStamp: 1556086700000
    },
    {
      "en": "burner",
      "ch": ["n.灯头，煤气头"],
      "id": "6B86",
      "wordIndex": 86,
      "wordType": "cet6",
      answerStatus: 1,
      timeStamp: 1556349080000
    },
    {
      "en": "blaze",
      "ch": ["vt.使燃烧", "vi.燃烧"],
      "id": "6B45",
      "wordIndex": 45,
      "wordType": "cet6",
      answerStatus: 1,
      timeStamp: 1556262020000
    },
  ],
  wrongWords: [
    {
      "en": "badge",
      "ch": ["n.徽章，像章；标志"],
      "id": "6B4",
      "wordIndex": 4,
      "wordType": "cet6",
      timeStamp: 1556428111863
    },
    {
      "en": "burner",
      "ch": ["n.灯头，煤气头"],
      "id": "6B86",
      "wordIndex": 86,
      "wordType": "cet6",
      timeStamp: 1556349080000
    },
    {
      "en": "blaze",
      "ch": ["vt.使燃烧", "vi.燃烧"],
      "id": "6B45",
      "wordIndex": 45,
      "wordType": "cet6",
      timeStamp: 1556262020000
    },
  ]
}], (err, doc) => {
if(err){
  console.error(err);
} else {
  console.log("init first User");
}
})