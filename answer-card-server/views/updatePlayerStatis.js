axios
  .post("/answerCard/updatePlayerStatis", {
    cetType: 6,
    openid: "test222",
    userData: {
      openid: "test222",
      nickName: "Sojourner",
      avatarUrl: "",
      answerWords: [
        {
          "en": "makeup",
          "ch": ["n.组织；性格；化装品"],
          "id": "6M11",
          "wordIndex": 11,
          "wordType": "cet6",
          answerStatus: 1,
          timeStamp: 1556781635010,
        },
        {
          "en": "manipulate",
          "ch": ["vt.操作；控制，手持"],
          "id": "6M15",
          "wordIndex": 15,
          "wordType": "cet6",
          answerStatus: 0,
          timeStamp: 1556781035010,
        },
      ],
      wrongWords: [
        {
          "en": "makeup",
          "ch": ["n.组织；性格；化装品"],
          "id": "6M11",
          "wordIndex": 11,
          "wordType": "cet6",
          answerStatus: 1,
          timeStamp: 1556781635010,
        }
      ]
    }
  })
  .then(console.log)
  .catch(console.log);
