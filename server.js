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
// getGuessEasy()

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
  const getGuessMedium = (cmd, args) => {

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
app.get('/py-data-easy', (req, res) => {
  getGuessEasy()
  res.send(aiGuess)
})

//Set endpoint for sending python MEDIUM MODE data. Collect Ensuing Guesses
app.get('/py-data-medium-get', async (req, res) => {
  await getGuessMedium('python3', ['scripts/Medium.py', guess, context]).then((value) => { res.send(value) })
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