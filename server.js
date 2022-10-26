//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Call Easy.py to recieve random guess
const spawn = require('child_process').spawn;
const ls = spawn('python', ['scripts/Easy.py']);
var aiGuess;
ls.stdout.on('data', (data) => { 
  aiGuess = data + '';
})
ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

//Set endpoint for sending python data
app.get('/py-data', (req, res) => {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['scripts/Easy.py']);
  ls.stdout.on('data', (data) => { 
    aiGuess = data + '';
  })
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
    res.send(aiGuess);
})

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));