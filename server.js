//We use express for Browser to interpret HTML
const express = require("express");
const app = express();
app.use(express.json());

//Recieve random guess to start always
var context;
var aiGuess;
var guess;
getGuessEasy()

//Set endpoint for sending python EASY MODE data. Collect Ensuing Guesses
app.get('/py-data-easy', (req, res) => {
  getGuessEasy();
  res.send(aiGuess);
})

//Get Easy Guess
function getGuessEasy() {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['scripts/Easy.py']);
  ls.stdout.on('data', (data) => {
    aiGuess = data + '';
  });
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
}

//Set endpoint for sending python MEDIUM MODE data. Collect Ensuing Guesses
app.get('/py-data-medium-get', (req, res) => {
  res.send(aiGuess);
})

//Set endpoint to recieve data from Script for Python AI
app.post('/py-data-medium-post',  (req, res) => {
  guess =  req.body.guess;
  context = req.body.context;
  console.log("Guess:" + guess);
  console.log("Context:" + context);
  getGuessMedium(guess, context);
})

//Get Medium Guess
function getGuessMedium(guess, context) {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['scripts/Medium.py', guess, context]); //call the function with an argument(s)
  ls.stdout.on('data', (data) => {
    aiGuess = data + '';
  });
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
}

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));