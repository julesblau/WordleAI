//We use express for Browser to interpret HTML
const express = require("express");
const app = express();

//Launch server
app.listen(8888, () => {
  console.log("Application started and Listening on port 8888");
});

//Avoid MIME type checking from browser
app.use(express.static(__dirname));

//Launch index.html page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });