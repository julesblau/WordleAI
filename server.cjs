const fs = require('fs');
//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Call Easy.py to recieve random guess
const spawn = require('child_process').spawn;
const ls = spawn('python', ['scripts/Easy.py']);

ls.stdout.on('data', (data) => { //EXPORT THIS TO SCRIPT.JS
    var aiGuess = data + '';
    fs.writeFile("resources/aiGuess.txt", aiGuess, err => {
      if(err) {
        console.log(err);
      }
    });
    // sendGuess();
    // exports(aiGuess);
    // console.log(aiGuess);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

// export function sendGuess() {
//     return aiGuess;
// }

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });


// //Launch index.html page
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
//     const spawn = require("child_process").spawn;
//     const pythonProcess = spawn('python',["./scripts/Easy.py"]);
//     pythonProcess.stdout.on('data', function(data) {
//     // RETURNED DATA
//     console.log("HERE:" , data.toString());
//     res.write(data);
//     res.end('end');
// });
//   });

//Launch server
app.listen(8888, () => {
  console.log("Application started and Listening on port 8888");
});
//Avoid MIME type checking from browser
app.use(express.static(__dirname));