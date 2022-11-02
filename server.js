//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Call Easy.py to recieve First  guess
var aiGuess;
getGuessEasy()

//Set endpoint for sending python data. Collect Ensuing Guesses
app.get('/py-data-easy', (req, res) => {
  getGuessEasy();
  res.send(aiGuess);
})

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));

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
