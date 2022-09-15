const fs = require("fs");

var validGuesses;
var possibleSolutions;

var readInLists = function() {

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

var checkGuess = function(guess) {

    validGuess = false;
    solved = false;

    validGuesses.forEach(element => {
        if(guess == element) {
            
            validGuess = true;

        }
    });

    if(validGuess) {

        possibleSolutions.forEach(element => {
            if(guess == element) {
                
                return true;
    
            }
        });

        return [0,1,0,2,1]

    }

    return false;

}