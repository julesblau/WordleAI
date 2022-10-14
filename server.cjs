//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Call Easy.py to recieve random guess
const spawn = require('child_process').spawn;
const ls = spawn('python', ['scripts/Easy.py']);

ls.stdout.on('data', (data) => { //EXPORT THIS TO SCRIPT.JS
    var aiGuess = data + '';
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8888");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));