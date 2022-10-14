const fs = require('fs');
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

//---Trying to send this over to script.js so we can use it for ai board, not working...
// export function sendGuess()
// {
//     return aiGuess;
// }

//Launch server
app.listen(8888, () => {
  console.log("Application started and Listening on port 8888");
});

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname));