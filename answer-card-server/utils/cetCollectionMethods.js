let res_Interf = require("../utils/resInterface");

// 获取指定文档的数量
async function getCount(col = null, query = {}) {
  if (!col) {
    return new Promise((resolve, reject) => {
      resolve({
        status: 1,
        msg: "no collection",
        result: ""
      })
    });
  }
  try {
    let docs =  await col.countDocuments(query);
    return {
      status: 0,
      msg: "",
      result: docs
    }
  } catch (err) {
    return {
      status: 1,
      msg: err.message,
      result: ""
    };
  }
}

// 获取指定索引的单词
async function getRandomWord(col = null, charIndex = Math.floor(Math.random() * 26)) {
  if (!col) {
    return new Promise((resolve, reject) => {
      resolve([1, "no collection", ""]);
    });
  }
  try {
    let doc = await col.findOne({charIndex: charIndex}).select('wordsLength').lean();
    let wordIndex = Math.floor(Math.random() * doc.wordsLength);
    let word = await col.findOne({
      charIndex: charIndex,
    }, {_id: 0}).map(res => {
      return res.words[wordIndex];
    }).lean();
    return [0, "", {word}];
  } catch (err) {
    return [1, err.message, ""];
  }
}

// 获取随机3个中文解释
async function getThreeCh (col = null, index = 0) {
  if (!col) {
    return new Promise((resolve, reject) => {
      resolve([1, "no collection", ""]);
    });
  }
  try {
    let p = await Promise.all([getRandomWord(col, (index + 3) % 26), getRandomWord(col, (index + 7) % 26), getRandomWord(col, (index + 11) % 26)])
    return [0, "", {threeCh: p}];
  } catch (err) {
    return [1, err.message, ""];
  }
}

// 组成答题卡
async function makeAnswerCard(word, threeCh) {
  if (!word || !threeCh) {
    return new Promise((resolve, reject) => {
      resolve([1, "no word or threeCh", ""]);
    });
  }
  try {
    let p = await Promise.all([word, threeCh]);
    if (p[0][0] == 1) throw p[0][1];
    if (p[1][0] == 1) throw p[1][1];
    let enWord = p[0][2].word;
    let chArr = p[1][2].threeCh;
    let res = {enWord, chArr};
    res.question = enWord.en;
    res.answerIndex = Math.floor(Math.random() * 4);
    res.answerId = enWord.id;
    let arr = chArr.map(w => {
      return w[2].word.ch;
    });
    arr.splice(res.answerIndex, 0, enWord.ch);
    res.options = arr;
    return [0, "", {answerCard: res}];
  } catch (err) {
    return [1, err.message, ""];
  }
}

// 单词权重计算
function calcWordWeight(word = {}) {
  if (!word.timeStamp) return 0;
  const TArr = [300000, 1800000, 43200000, 86400000, 172800000, 345600000, 604800000, 1296000000];
  const pArr = [1, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65];
  let now = Date.now();
  let t = now - parseInt(word.timeStamp);
  let minIndex = 0;
  let minT = Math.abs(t - TArr[minIndex]);
  let T = TArr[minIndex];
  let p = pArr[minIndex];
  for (let i = 1, len = TArr.length; i < len; i++) {
    let curT = Math.abs(t - TArr[i])
    if (curT < minT) {
      minIndex = i;
      minT = curT;
      T = TArr[minIndex];
      p = pArr[minIndex]
    }
  }
  return 1 + p * (0.2 * T - minT);
}

// 权重最大的单词
function getMaxWeightWord(words = [], wordType, ecludeList) {
  if (!Array.isArray(words)) return null;
  if (!wordType) return null;
  let maxWeightWord;
  let maxWeight = Number.MIN_SAFE_INTEGER;
  words.map((word, index) => {
    if (word.wordType !== wordType) return;
    let wordWeight = calcWordWeight(word);
    let isInEclude = false;
    for (let i = 0, len = ecludeList.length; i < len; i++) {
      if (word.id === ecludeList[i].id) {
        isInEclude = true;
        break;
      }
    }

    if (wordWeight > maxWeight && !isInEclude) {
      maxWeight = wordWeight;
      maxWeightWord = word;
    }
  })
  console.log(maxWeight, maxWeightWord);
  return maxWeight > 0 ? maxWeightWord : null;
}

// 初始化玩家
function initPlayer(playerInfo) {
  if (!playerInfo) return false;
  if (!playerInfo.openid) return false;
  return {
    openid: playerInfo.openid,
    nickName: playerInfo.nickName || '',
    avatarUrl: playerInfo.avatarUrl || '',
    gender: playerInfo.gender || 0,
    answerWords: Array.isArray(playerInfo.answerWords) ? playerInfo.answerWords : [],
    wrongWords: Array.isArray(playerInfo.wrongWords) ? playerInfo.wrongWords : []
  }
}

module.exports = {
  getCount: getCount,
  getRandomWord: getRandomWord,
  getThreeCh: getThreeCh,
  makeAnswerCard: makeAnswerCard,
  calcWordWeight: calcWordWeight,
  getMaxWeightWord: getMaxWeightWord,
  initPlayer: initPlayer
};
