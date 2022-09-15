const fs = require("fs");

var words;

fs.readFile("/resources/words.txt", (err, words) => {
    if (err) throw err;
});

console.log(words);

//var solution = Math.random(0, words.length);

