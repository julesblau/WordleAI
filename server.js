//We use express for Browser to interpret HTML
const express = require("express")
const app = express()
app.use(express.json())

//Recieve random guess to start always
var context = undefined
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

//Set endpoint for sending python BEGINNER MODE data. Collect Ensuing Guesses
app.get('/py-data-beginner-get', async (req, res) => {
  await getGuess('python3', ['scripts/Beginner.py', guess, context]).then((value) => { res.send(value) })
})

//Set endpoint for sending python EXPERT MODE data. Collect Ensuing Guesses
app.get('/py-data-expert-get', async (req, res) => {
  await getGuess('python3', ['scripts/Expert.py', guess, context]).then((value) => { res.send(value) })
})

//Set endpoint for sending python SOLVER MODE data. Collect Ensuing Guesses
app.get('/py-data-solver-get', async (req, res) => {
  await getGuess('python3', ['scripts/Solver.py', guess, context]).then((value) => { res.send(value) })
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