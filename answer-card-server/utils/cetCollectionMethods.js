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
function getWord(col = null, query = {}) {

}

module.exports = {
  getCount: getCount,
  getWord: getWord
};
