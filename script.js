// Based on wordle_clone by GitHub Username: Morgenstern2573 (Author)
// https://github.com/Morgenstern2573/wordle_clone/blob/master/build/script.js

import { SOLUTIONS } from "./resources/solutions.js"

const Difficulty = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
}

let currDifficulty = Difficulty.Easy // Default to easy if there is an error with parameter handling
const params = new URLSearchParams(document.location.search)
const diffParam = params.get("difficulty")
currDifficulty = diffParam
document.getElementById("subheader").textContent = "Head to Head: " + currDifficulty.charAt(0).toUpperCase() + currDifficulty.slice(1)

// Initialize all global variables
const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let correctGuessString = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
let aiGuessHistory = []
let aiGuessContext = []
let timesSolved = 0
let guessesToSolve = 0

// Wrapper fuction to check AI guess based on difficulty
async function checkAIGuess() {

    switch (currDifficulty) {
        case Difficulty.Easy:
            await getGuess('http://localhost:8889/py-data-easy-get').then((value) => { checkAiLogic(value) })
            break
        case Difficulty.Medium:
            await getGuess('http://localhost:8889/py-data-medium-get').then((value) => { checkAiLogic(value) })
            break
        default:
            await getGuess('http://localhost:8889/py-data-hard-get').then((value) => { checkAiLogic(value) })
            break
    }

}

// Logic to check AI guess for correctness
function checkAiLogic(guessString) {

    let context = [null, null, null, null, null]
    let contextString = ""
    guessString = guessString.slice(0, -1)

    let rightGuess = Array.from(correctGuessString)
    currentGuess = Array.from(guessString)
    aiGuessHistory.push(guessString)

    let letterColor = [null, null, null, null, null]
    for (let i = 0; i < 5; i++) {
        let letterPosition = rightGuess.indexOf(currentGuess[i])

        if (letterPosition === -1) {
            letterColor[i] = 'grey'
            context[i] = '0'
        } else if (currentGuess[i] === rightGuess[i]) {
            letterColor[i] = 'green'
            context[i] = '2'
        }

    }

    for (let i = 0; i < 5; i++) {
        if (letterColor[i] == null) {
            let letterPosition = rightGuess.indexOf(currentGuess[i])
            if (letterColor[letterPosition] == 'green') {
                rightGuess[letterPosition] = '#'
                letterPosition = rightGuess.indexOf(currentGuess[i])
                if (letterPosition == -1) {
                    letterColor[i] = 'grey'
                    context[i] = '0'
                } else {
                    if (letterColor[letterPosition] == 'green') {
                        rightGuess[letterPosition] = '#'
                        letterPosition = rightGuess.indexOf(currentGuess[i])
                        if (letterPosition == -1) {
                            letterColor[i] = 'grey'
                            context[i] = '0'
                        }
                    } else {
                        letterColor[i] = 'yellow'
                        context[i] = '1'
                        rightGuess[letterPosition] = '#'
                    }
                }
            } else if (letterPosition == -1) {
                letterColor[i] = 'grey'
                context[i] = '0'
            } else {
                letterColor[i] = 'yellow'
                context[i] = '1'
                rightGuess[letterPosition] = '#'
            }
        }
    }

    contextString = context.join("")
    aiGuessContext.push(contextString)

    if (guessString == correctGuessString) {
        currentGuess = []
        aiGuessHistory = []
        aiGuessContext = []
        timesSolved++
        guessesToSolve += (7 - guessesRemaining)
        guessesRemaining = 0
        clearServer()
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []

        if (guessesRemaining == 0) {
            currentGuess = []
            aiGuessHistory = []
            aiGuessContext = []
            clearServer()
        } else {
            postGuess()
        }
    }

}

//Functions to access server endpoints
async function getGuess(url) {
    const aiGuess = await fetch(url)
    const aiGuessText = await aiGuess.text()
    return aiGuessText
}

async function postGuess() {

    fetch('http://localhost:8889/py-data-post',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guess: aiGuessHistory,
                context: aiGuessContext
            })
        })
}

async function clearServer() {

    fetch('http://localhost:8889/reset-game',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

}

//Simulate a number of games to test AI accuracy
async function getMetrics() {
    let gamesSimulated = 50

    console.log("Starting Simulation of " + gamesSimulated + " games...")
    
    for(let i = 1; i <= gamesSimulated; i++) {

        guessesRemaining = NUMBER_OF_GUESSES
        currentGuess = []
        correctGuessString = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
        aiGuessHistory = []
        aiGuessContext = []

        while(guessesRemaining > 0) {
            await checkAIGuess()
        }

        if(i % (gamesSimulated / 10) == 0) {
            console.log(i + "/" + gamesSimulated)
        }
        
    }

    console.log("Games Simulated: " + gamesSimulated)
    console.log("Times Solved: " + timesSolved + " (" + (timesSolved / gamesSimulated * 100).toFixed(2) + "%)") 
    console.log("Average Number of Guesses to Solution: " + guessesToSolve / timesSolved)

}

getMetrics()
