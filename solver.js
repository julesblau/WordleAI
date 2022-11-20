const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let guessHistory = []
let guessContext = []
let aiSuggestedGuess = ""

let board = document.getElementById("solver")

function initRow() {

    let row = document.createElement("div")
    row.id = "solver-letter-row"

    row.className = "letter-row"

    for (let j = 0; j < 5; j++) {
        let box = document.createElement("div")
        box.id = "solver-letter-box"
        box.className = "letter-box"
        row.appendChild(box)
    }
    board.appendChild(row)
}

// Wrapper fuction to check AI guess based on difficulty
async function getAIGuess() {
    await getGuess('http://localhost:8889/py-data-hard-get').then((value) => { 

        let row = document.getElementById("solver").children[6 - guessesRemaining]
        for (let i = 0; i < 5; i++) {
            let box = row.children[i]
            box.textContent = value[i]
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = "orange"
        }
     })
}

// Logic to prepare user guess for AI suggestion 
function processWordForAIGuess() {

    let contextString = ""
    let guessString = ""

    let row = document.getElementById("solver").children[6 - guessesRemaining]
    currentGuess = Array.from(guessString)

    for (let i = 0; i < 5; i++) {
        let box = row.children[i]
        if(box.style.backgroundColor == "grey"){
            contextString += "0"
        }else if(box.style.backgroundColor == "yellow"){
            contextString += "1"
        }else{
            contextString += "2"
        }

        guessString += box.textContent
    }

    guessContext.push(contextString)
    guessHistory.push(guessString)

    postGuess()

    guessesRemaining -= 1
    currentGuess = []
    nextLetter = 0

    if (guessesRemaining == 0) {
        currentGuess = []
        guessHistory = []
        guessContext = []
        clearServer()
    } else {
        initRow()
        getAIGuess()
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
                guess: guessHistory,
                context: guessContext
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

// Insert letter into board on keyboard input
function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementById("solver").children[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    box.style.backgroundColor = 'grey'
    currentGuess.push(pressedKey)
    nextLetter += 1
}

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
        if (currentGuess.length != 5) {
            toastr.error("Not enough letters!")
            return false
        }

        processWordForAIGuess()
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

// Event listener toggling boxes
document.getElementById("solver").addEventListener("click", (e) => {
    var board = document.getElementById("solver")
    const target = e.target

    if (!target.classList.contains("filled-box")) {
        return
    }else if (target.parentElement != board.children[6 - guessesRemaining]) {
        return
    }
    let currentColor = target.style.backgroundColor

    if (currentColor == "grey") {
        currentColor = "yellow"
    }else if (currentColor == "yellow") {
        currentColor = "green"
    }else if (currentColor == "green"){
        currentColor = "grey"
    }

    target.style.backgroundColor = currentColor
})

// Delete letter from box
function deleteLetter() {
    let row = document.getElementById("solver").children[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    box.style.backgroundColor = "white"
    currentGuess.pop()
    nextLetter -= 1
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


initRow()