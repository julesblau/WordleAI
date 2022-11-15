//We use express for Browser to interpret HTML
const express = require("express")
const app = express()
app.use(express.json())

//Recieve random guess to start always
var context
var aiGuess
var guess
getGuessEasy()

//Get Easy Guess
function getGuessEasy() {
  const spawn = require('child_process').spawn
  const ls = spawn('python3', ['scripts/Easy.py'])
  ls.stdout.on('data', (data) => {
    aiGuess = data + ''
  })
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
}

//Get Medium Guess
function getGuessMedium() {
  const spawn = require('child_process').spawn
  console.log(guess + " " + context)
  const ls = spawn('python3', ['scripts/Medium.py', guess, context]) //Call the function with an arguments
  ls.stdout.on('data', (data) => {
    aiGuess = data + ''
  })
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })
}

//Set endpoint for sending python EASY MODE data. Collect Ensuing Guesses
app.get('/py-data-easy', (req, res) => {
  getGuessEasy()
  res.send(aiGuess)
})

//Set endpoint for sending python MEDIUM MODE data. Collect Ensuing Guesses
app.get('/py-data-medium-get', (req, res) => {
  getGuessMedium()
  res.send(aiGuess)
})

//Set endpoint to recieve data from Script for Python AI
app.post('/py-data-medium-post', (req, res) => {
  guess = req.body.guess
  context = req.body.context
  console.log("Server Guess History: " + guess)
  console.log("Server Context: " + context)
  res.sendStatus(200)
})

//Set endpoint to clear game
app.post('/reset-game', (req, res) => {
  guess = undefined
  context = undefined
  res.sendStatus(200)
})

//Launch server
app.listen(8889, () => {
  console.log("Application started and Listening on port 8889")
})

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname))