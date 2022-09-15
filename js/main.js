const fs = require("fs");

var validGuesses;
var possibleSolutions;

function readInLists() {

    fs.readFile("/resources/valid_guesses.txt", (err, validGuesses) => {
        if (err) throw err;
    });

    console.log(validGuesses);

}

function getRandomInt(max) {

    return Math.floor(Math.random() * max)

}

var chosenWord  = possibleSolutions[getRandomInt(possibleSolutions.length)];

//console.log(chosenWord)

