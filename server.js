//We use express for Browser to interpret HTML
const express = require("express")
const { chmod } = require("fs")
const app = express()
app.use(express.json())

//Recieve random guess to start always
var context = undefined
var aiGuess = undefined
var guess = undefined

const spawn = require('child_process').spawn

//Get Guess from Python
  const getGuess = (cmd, args) => {
    return new Promise((resolve, reject) => {
      try {
        const runCommand = spawn(cmd, args)
        runCommand.stdout.on('data', data => resolve(data + ''))
      } catch(e) {
        reject(e)
      }
    })
  }

//Set endpoint for sending python EASY MODE data. Collect Ensuing Guesses
app.get('/py-data-easy-get', async (req, res) => {
  await getGuess('python3', ['scripts/Easy.py', guess, context]).then((value) => { res.send(value) })
})

//Set endpoint for sending python MEDIUM MODE data. Collect Ensuing Guesses
app.get('/py-data-medium-get', async (req, res) => {
  await getGuess('python3', ['scripts/Medium.py', guess, context]).then((value) => { res.send(value) })
})

//Set endpoint to recieve data from Script for Python AI
app.post('/py-data-post', (req, res) => {
  guess = req.body.guess
  context = req.body.context
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
  console.log("Application started and listening on port 8889")
})

//Avoid MIME type checking from browser for boards
app.use(express.static(__dirname))