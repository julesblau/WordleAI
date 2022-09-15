const fs = require("fs");

var words;

fs.readFile("resources/words.txt", (err, words) => {
    if (err) throw err;
    console.log(words.toString());
});

console.log(words.length);

var solution = Math.random();

