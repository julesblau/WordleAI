// Based on wordle_clone by GitHub Username: Morgenstern2573 (Author)
// https://github.com/Morgenstern2573/wordle_clone/blob/master/build/script.js

import { SOLUTIONS } from "./resources/solutions.js"
import { GUESSES } from "./resources/valid_guesses.js"

const Difficulty = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
}

let currDifficulty = Difficulty.Easy // Default to easy if there is an error with parameter handling
const params = new URLSearchParams(document.location.search)
const diffParam = params.get("difficulty")
currDifficulty = diffParam

// Initialize all global variables
const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let correctGuessString = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
let aiGuessHistory = []
let aiGuessContext = []

console.log(correctGuessString)

// Initialize player and AI boards
function initBoard(boardName) {
    let board = document.getElementById(boardName)

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.id = boardName + "-letter-row"
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.id = boardName + "-letter-box"
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

// Function to control turns
function turn() {
    if (checkPlayerGuess()) {
        checkAIGuess()
    }
}

// Check player guess for validity and correctness
function checkPlayerGuess() {
    let row = document.getElementById("player-game-board").children[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(correctGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return false
    }

    if (!GUESSES.includes(guessString)) {
        toastr.error("Invalid Guess!")
        return false
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === correctGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        fillAiBoard()
        return false
    } else {
        currentGuess = []
        nextLetter = 0
        return true
    }
}

// Wrapper fuction to check AI guess based on difficulty
async function checkAIGuess() {

    console.log("Client Guess History: " + aiGuessHistory)
    console.log("Client Context: " + aiGuessContext)

    switch (currDifficulty) {
        case Difficulty.Easy:
            await getGuessEasy().then((value) => { checkAiLogic(value) })
            break
        case Difficulty.Medium:
            await getGuessMedium().then((value) => { checkAiLogic(value) })
            break
        default:
            await getGuessHard().then((value) => { checkAiLogic(value) })
            break
    }

}

// Logic to check AI guess for correctness
function checkAiLogic(guessString) {

    let contextString = ""
    guessString = guessString.slice(0, -1)

    let row = document.getElementById("ai-game-board").children[6 - guessesRemaining]
    let rightGuess = Array.from(correctGuessString)
    currentGuess = Array.from(guessString)
    aiGuessHistory.push(guessString)

    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
            contextString += "0"
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
                contextString += "2"
            } else {
                letterColor = 'yellow'
                contextString += "1"
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor
            box.classList.add("filled-box")
        }, delay)
    }

    aiGuessContext.push(contextString)

    if (guessString == correctGuessString) {
        toastr.error("The AI guessed right! Game over!")
        guessesRemaining = 0
        fillAiBoard()
        currentGuess = []
        aiGuessHistory = []
        aiGuessContext = []
        clearServer()
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining == 0) {
            fillAiBoard()
            toastr.info("Neither player got it! It's a draw!")
            toastr.info(`The right word was: "${correctGuessString}"`)
            currentGuess = []
            aiGuessHistory = []
            aiGuessContext = []
            clearServer()
        } else {
            postGuessMedium()
        }
    }

}

//Functions to access server endpoints
async function getGuessEasy() {
    const aiGuess = await fetch('http://localhost:8889/py-data-easy')
    const aiGuessText = await aiGuess.text()
    return aiGuessText
}

async function postGuessMedium() {

    var _continue = false

    fetch('http://localhost:8889/py-data-medium-post',
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
        }).then(response => {

            // console.log(response.status)

            // if (response.status == 200) {

            //     _continue = true

            // }

        })

    // console.log(_continue)

    // if (_continue) {


    // }
}

async function getGuessMedium() {
    const aiGuess = await fetch('http://localhost:8889/py-data-medium-get')
    const aiGuessText = await aiGuess.text()
    return aiGuessText
}

async function getGuessHard() {
    const aiGuess = await fetch('http://localhost:8889/py-data-hard-get')
    const aiGuessText = await aiGuess.text()
    return aiGuessText
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

// Fill AI board with guesses at end of game
function fillAiBoard() {

    for (let i = 0; i < aiGuessHistory.length; i++) {
        let row = document.getElementById("ai-game-board").children[i]
        for (let j = 0; j < 5; j++) {
            let box = row.children[j]
            box.textContent = aiGuessHistory[i][j]
        }
    }

}

// Insert letter into player board on keyboard input
function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementById("player-game-board").children[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

//Animation function for colors
const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        const node = element
        node.style.setProperty('--animate-duration', '0.3s')

        node.classList.add(`${prefix}animated`, animationName)

        function handleAnimationEnd(event) {
            event.stopPropagation()
            node.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    })

// Event listener for physical keyboard
document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter" && guessesRemaining != 0) {
        turn()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

// Event listener for on-screen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})

//Shade on-screen keyboard based on letter correctness
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// Delete letter from box
function deleteLetter() {
    let row = document.getElementById("player-game-board").children[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

//Initialize both boards to start game
initBoard("player-game-board")
initBoard("ai-game-board")
