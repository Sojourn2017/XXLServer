const api = require("./api");
const http = require("http");
const url = require("url");
const https = require("https");
const fs = require("fs");

const MIME = {
  html: "text/html",
  css: "text/css",
  js: "application/x-javascript",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  mp3: "audio/mp3",
  json: "application/json",
  ttf: "application/x-font-ttf"
};

const options = {
  key: fs.readFileSync("./s2l/Nginx/2_s2l.xyz.key"),
  cert: fs.readFileSync("./s2l/Nginx/1_s2l.xyz_bundle.crt")
};

function handleStatic(pathName) {
  let reg = /\.([a-zA-Z0-9]*)$/;
  if (reg.test(pathName)) {
    let type = RegExp.$1;
    return MIME[type];
  }
}

function Server() {
  http
    .createServer((req, res) => {
      let pathName = url.parse(req.url).pathname;
      console.log(pathName)
      // 判断静态资源
      var fileType = handleStatic(pathName);
      console.log(fileType)
      if (fileType) {
        api["/"](req, res, pathName, fileType);
      } else {
        res.writeHead(404, {
          "content-type": `application/json`
        });

        res.end("404 Not Found");
      }
    })
    .listen(50011, "0.0.0.0", () => {
      console.log("server running at port 50011");
    });
}

function HttpsServer () {
  https
    .createServer(options, (req, res) => {
      let pathName = url.parse(req.url).pathname;
      console.log(pathName)
      // 判断静态资源
      var fileType = handleStatic(pathName);
      console.log(fileType)
      if (fileType) {
        api["/"](req, res, pathName, fileType);
      } else {
        res.writeHead(404, {
          "content-type": `application/json`
        });

        res.end("404 Not Found");
      }
    })
    .listen(50012, "0.0.0.0", () => {
      console.log("htpps server running at port 50012");
    });
}


Server();

HttpsServer();
