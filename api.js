const fs = require("fs");


const API = {};

/**
 * 首页
 */

API["/"] = API["/index"] = function(
  req,
  res,
  pathName = "/index.html",
  contextType = "text/html"
) {
  fs.readFile('.' + pathName, (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(404, {
        "content-type": `text/plain`
      });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "content-type": contextType
      });
      res.end(data);
    }
  });
};

module.exports = API;
