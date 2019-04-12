const fs = require('fs');

fs.readFile("./cet4.txt", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  let wordsList = data.toString('utf8').split('\n');
  let reg = /([a-z.&]*?[^a-z.&\s]+)/g;
  let cet4 = [];
  wordsList.forEach((str) => {
    let arr = str.split(' ');
    if (arr.length == 2) {
      if (typeof arr[0] !== 'string' && arr[0].length === 0) {
        return;
      }
      let char = arr[0][0].toLocaleUpperCase();
      let charIndex = char.charCodeAt() - 65;
      let word = {
        en: arr[0],
        ch: [],
      };
      let m = reg.exec(arr[1]);
      while(m) {
        word.ch.push(m[1]);
        m = reg.exec(arr[1]);
      }
      if (cet4[charIndex]) {
        word.id = char + cet4[charIndex].wordsLength;
        word.wordIndex = cet4[charIndex].wordsLength;
        cet4[charIndex].words.push(word);
        cet4[charIndex].wordsLength++;
      } else {
        word.id = char + 0;
        word.wordIndex = 0;
        cet4[charIndex] = {
          char: char,
          charIndex: charIndex,
          wordsLength: 1,
          words: [word],
        }
      }
    }
  })
  fs.writeFile('./cet4.json', JSON.stringify(cet4) , console.log);
})
