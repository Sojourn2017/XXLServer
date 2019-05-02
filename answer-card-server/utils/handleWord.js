const fs = require('fs');

fs.readFile("./cet6.txt", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  let wordsList = data.toString('utf8').split('\n');
  let reg = /([a-z.&]*?[^a-z.&\s]+)/g;
  let cet4 = [];
  let wordType = '6';
  wordsList.forEach((str) => {
    // let arr = str.split(' ');

    str = str.replace(/\s{3,}/, '  ')
    let arr = str.split('  ');

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
        word.id = wordType + char + cet4[charIndex].wordsLength;
        word.wordIndex = cet4[charIndex].wordsLength;
        word.wordType = 'cet6';
        cet4[charIndex].words.push(word);
        cet4[charIndex].wordsLength++;
      } else {
        word.id = wordType + char + 0;
        word.wordIndex = 0;
        word.wordType = 'cet6';
        cet4[charIndex] = {
          char: char,
          charIndex: charIndex,
          wordsLength: 1,
          words: [word],
        }
      }
    }
  })
  fs.writeFile('./cet6.json', JSON.stringify(cet4) , console.log);
})
