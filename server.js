//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Call Easy.py to recieve First  guess
var aiGuess;
getGuess()

//Set endpoint for sending python data. Collect Ensuing Guesses
app.get('/py-data', (req, res) => {
  getGuess();
  res.send(aiGuess);
})

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));

function getGuess() {
  const spawn = require('child_process').spawn;
  const ls = spawn('python3', ['scripts/Easy.py']);
  ls.stdout.on('data', (data) => {
    aiGuess = data + '';
  });
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
}
