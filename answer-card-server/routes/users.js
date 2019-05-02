var express = require('express');
var router = express.Router();
var axios = require('axios');
let res_Interf = require("../utils/resInterface");

const CONSTVALUE = require('../constValue');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post("/login", function (req, res, next) {
  let js_code = req.body.js_code;
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${CONSTVALUE.appid}&secret=${CONSTVALUE.secret}&js_code=${js_code}&grant_type=authorization_code`;
  axios.get(url).then(response => {
    let data = response.data;
    res_Interf.send(res, 0, "", data);
  }).catch(err => {
    res_Interf.send(res, 1, err.message);
  })
})

module.exports = router;
