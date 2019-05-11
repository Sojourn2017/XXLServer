let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let res_Interf = require("../utils/resInterface");
let Cet4 = require("../models/Cet4");
let Cet6 = require("../models/Cet6");
let User = require("../models/User");
let fs = require("fs");

let cetCollectionMethods = require("../utils/cetCollectionMethods");

// 连接mangoDB数据库
mongoose.connect("mongodb://118.24.149.139:27017/answerCard", {
  useNewUrlParser: true
});

mongoose.connection.on("connected", function() {
  console.log("mongodb connected success");

  let count = cetCollectionMethods.getCount(Cet4);
  count.then(res => {
    console.log(`Cet4 count: ${JSON.stringify(res)}`);
    if (res.status) {
      console.log(res.err.message);
    } else {
      if (res.result == 0) {
        fs.readFile("./utils/cet4.json", (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          let wordsList = JSON.parse(data.toString("utf8"));
          Cet4.create(wordsList, (err, doc) => {
            if (err) {
              console.error(err);
            } else {
              console.log("init Cet4 SUCCESS");
            }
          });
        });
      }
    }
  });

  let cet6Count = cetCollectionMethods.getCount(Cet6);
  cet6Count.then(res => {
    console.log(`Cet6 count: ${JSON.stringify(res)}`);
    if (res.status) {
      console.log(res.err.message);
    } else {
      if (res.result == 0) {
        fs.readFile("./utils/cet6.json", (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          let wordsList = JSON.parse(data.toString("utf8"));
          Cet6.create(wordsList, (err, doc) => {
            if (err) {
              console.error(err);
            } else {
              console.log("init Cet6 SUCCESS");
            }
          });
        });
      }
    }
  });
});

mongoose.connection.on("error", function() {
  console.log("mongodb connected fail");
});

mongoose.connection.on("disconnected", function() {
  console.log("mongodb connected disconnected");
});

// 接口测试
router.get("/test", (req, res, next) => {
  let cetType = parseInt(req.query.cetType) || 0;
  let openId = req.query.openid;
  let userData = req.query.userData;
  if (!openId) {
    res_Interf.send(res, 1, "no openid!");
  }
  User.findOne({ openid: openId })
    .lean()
    .exec((err, user) => {
      if (err) {
        res_Interf.send(res, 1, err.message);
      } else {
        if (user && user.wrongWords) {
          let player = cetCollectionMethods.initPlayer({
            openid: openId
          });
          User.update(
            { openid: openId },
            {
              $push: {
                answerWords: {
                  $each: userData.answerWords
                },
                wrongWords: {
                  $each: userData.wrongWords
                }
              }
            },
            (err, doc) => {
              if (err) {
                res_Interf.send(res, 1, err.message);
              } else {
                res_Interf.send(res, 0, "", "init play success");
              }
            }
          );
        } else {
          let player = cetCollectionMethods.initPlayer({
            openid: openId
          });
          User.create(player, (err, doc) => {
            if (err) {
              res_Interf.send(res, 1, err.message);
            } else {
              res_Interf.send(res, 0, "", "init play success");
            }
          });
        }
      }
    });
});

// 获取单词
router.post("/getWord", function(req, res, next) {
  let cetType = parseInt(req.body.cetType) || 0;
  let openId = req.body.openid;
  if (!openId) {
    res_Interf.send(res, 1, "no openid!");
  }
  if (cetType != 4 && cetType != 6) {
    res_Interf.send(res, 1, "cetType Not Found!");
    return;
  }
  let Cet = cetType == 4 ? Cet4 : Cet6;
  let wordType = cetType == 4 ? "cet4" : "cet6";
  User.findOne({ openid: openId })
    .lean()
    .exec((err, user) => {
      if (err) {
        res_Interf.send(res, 1, err.message);
      } else {
        if (user && user.wrongWords) {
          let answerWords = user.answerWords;
          let time = Date.now() - 180000;
          let ecludeList = answerWords.filter((word) => {
            return word.timeStamp > time;
          })
          let randomIndex = Math.floor(Math.random() * 26);
          let maxWeightWord = cetCollectionMethods.getMaxWeightWord(
            user.wrongWords,
            wordType,
            ecludeList
          );
          if (maxWeightWord) {
            let answerCard = cetCollectionMethods.makeAnswerCard(
              new Promise((resolve, reject) =>
                resolve([0, "", { word: maxWeightWord }])
              ),
              cetCollectionMethods.getThreeCh(Cet, randomIndex + 1)
            );
            answerCard.then(params => {
              res_Interf.send.apply(null, [res, ...params]);
            });
          } else {
            let answerCard = cetCollectionMethods.makeAnswerCard(
              cetCollectionMethods.getRandomWord(Cet, randomIndex),
              cetCollectionMethods.getThreeCh(Cet, randomIndex + 1)
            );
            answerCard.then(params => {
              res_Interf.send.apply(null, [res, ...params]);
            });
          }
        }
      }
    });
});

// 更新玩家信息
router.post("/updatePlayer", function(req, res, next) {
  let openId = req.body.openid;
  let userData = req.body.userData;
  if (!openId) {
    res_Interf.send(res, 1, "no openid!");
    return;
  }
  User.findOne({ openid: openId })
    .lean()
    .exec((e1, user) => {
      if (e1) {
        res_Interf.send(res, 1, e1.message);
      } else {
        if (user) {
          let newUserInfo = { openid: openId };
          userData.nickName && (newUserInfo.nickName = userData.nickName);
          userData.avatarUrl && (newUserInfo.avatarUrl = userData.avatarUrl);
          userData.gender && (newUserInfo.gender = userData.gender);
          User.update({ openid: openId }, newUserInfo, (e2, doc) => {
            if (e2) {
              res_Interf.send(res, 1, e2.message);
            } else {
              res_Interf.send(res, 0, "", "update player success");
            }
          });
        } else {
          let newUserInfo = {
            openid: openId,
            answerWords: [],
            wrongWords: []
          };
          userData.nickName && (newUserInfo.nickName = userData.nickName);
          userData.avatarUrl && (newUserInfo.avatarUrl = userData.avatarUrl);
          userData.gender && (newUserInfo.gender = userData.gender);
          User.create(newUserInfo, (e3, doc) => {
            if (e3) {
              res_Interf.send(res, 1, e3.message);
            } else {
              res_Interf.send(res, 0, "", "init player success");
            }
          });
        }
      }
    });
});

// 更新答题记录
router.post("/updatePlayerStatis", function(req, res, next) {
  let openId = req.body.openid;
  let userData = req.body.userData;
  if (!openId) {
    res_Interf.send(res, 1, "no openid!");
    return;
  }
  User.findOne({ openid: openId })
    .lean()
    .exec((e1, user) => {
      if (e1) {
        res_Interf.send(res, 1, e1.message);
      } else {
        if (user) {
          User.update(
            { openid: openId },
            {
              $push: {
                answerWords: {
                  $each: userData.answerWords
                },
                wrongWords: {
                  $each: userData.wrongWords
                }
              }
            },
            (e2, doc) => {
              if (e2) {
                res_Interf.send(res, 1, e2.message);
              } else {
                res_Interf.send(res, 0, "", "update player success");
              }
            }
          );
        } else {
          let player = cetCollectionMethods.initPlayer(userData);
          User.create(player, (e3, doc) => {
            if (e3) {
              console.log(e3.message);
              res_Interf.send(res, 1, e3.message);
            } else {
              res_Interf.send(res, 0, "", "init player success");
            }
          });
        }
      }
    });
});

// 获取答题记录
router.post("/playerStatis", function(req, res, next) {
  let openId = req.body.openid;
  let timeStart = parseInt(req.body.timeStart) || 0;
  let timeEnd = parseInt(req.body.timeEnd) || Date.now();

  if (!openId) {
    res_Interf.send(res, 1, "no openid!");
    return;
  }

  User.findOne({ openid: openId }, {_id: 0})
    .map(res => {
      res.answerWords = res.answerWords.filter((word) => {
        return word.timeStamp >= timeStart && word.timeStamp < timeEnd;
      })
      res.wrongWords = res.wrongWords.filter((word) => {
        return word.timeStamp >= timeStart && word.timeStamp < timeEnd;
      })
      return res;
    })
    .lean()
    .exec((e1, user) => {
      if (e1) {
        res_Interf.send(res, 1, e1.message);
      } else {
        if (user) {
          res_Interf.send(res, 0, '', user);
        } else {
          res_Interf.send(res, 1, "user not found");
        }
      }
    });
});

module.exports = router;
