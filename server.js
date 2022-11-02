//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Recieve random guess to start always
var aiGuess;
getGuessEasy()

//Set endpoint for sending python EASY MODE data. Collect Ensuing Guesses
app.get('/py-data-easy', (req, res) => {
  getGuessEasy();
  res.send(aiGuess);
})

//Get Easy Guess
function getGuessEasy() {
  const spawn = require('child_process').spawn;
  const ls = spawn('python3', ['scripts/Easy.py']);
  ls.stdout.on('data', (data) => {
    aiGuess = data + '';
  });
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
}

//Set endpoint for sending python MEDIUM MODE data. Collect Ensuing Guesses
app.get('/py-data-medium', (req, res) => {
  // getGuessMedium();
  // res.send(aiGuess);
})

//Set endpoint to recieve data from Script for Python AI
// app.post('')

//Get Medium Guess
// function getGuessMedium() {
//   const spawn = require('child_process').spawn;
//   const ls = spawn('python', ['scripts/Medium.py']);
//   ls.stdout.on('data', (data) => {
//     aiGuess = data + '';
//   });
//   ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
//   });
// }

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));