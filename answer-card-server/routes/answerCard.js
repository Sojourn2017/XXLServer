let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let res_Interf =  require("../utils/resInterface");
let Cet4 = require('../models/Cet4');
let Cet6 = require('../models/Cet6');
let fs = require('fs');

let cetCollectionMethods = require('../utils/cetCollectionMethods')

// 连接mangoDB数据库
mongoose.connect('mongodb://118.24.149.139:27017/answerCard', { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log('mongodb connected success');

  let count = cetCollectionMethods.getCount(Cet4);
  count.then((res) => {
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
          let wordsList = JSON.parse(data.toString('utf8'));
          Cet4.create(wordsList, (err, doc) => {
            if(err){
              console.error(err);
            } else {
              console.log("init Cet4 SUCCESS");
            }
          });
        })
      }
    }
  })
})

mongoose.connection.on('error',function () {
  console.log('mongodb connected fail');
})

mongoose.connection.on('disconnected',function () {
  console.log('mongodb connected disconnected');
})


// 接口测试
router.get('/test', (req, res, next) => {
  let charIndex = Math.floor(Math.random() * 26);
  Cet4.findOne({charIndex: charIndex}).select('wordsLength').lean().exec((err, doc) => {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      let wordIndex = Math.floor(Math.random() * doc.wordsLength);
      console.log('wordIndex: ',wordIndex)
      Cet4.findOne({
        charIndex: charIndex,
      }, {_id: 0}).map(res => {
        return res.words[wordIndex];
      }).lean().exec((err2, word) => {
        if (err2) {
          res_Interf.send(res,"1",err2.message);
        } else {
          res_Interf.send(res,"0", "", {
            word
          });
        }
      })
    }
  })
})

// 获取单词
router.post("/getWord",function (req, res, next) {
  let userId = req.cookies.userId;
  
})

module.exports = router;