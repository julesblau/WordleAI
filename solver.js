const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let aiGuessHistory = []
let aiGuessContext = []

let board = document.getElementById("solver")

function initBoard() {

    let row = document.createElement("div")
    row.id = "solver-letter-row-" + (6 - guessesRemaining)
    console.log(row.id)

    row.className = "letter-row"

    for (let j = 0; j < 5; j++) {
        let box = document.createElement("div")
        box.id = "solver-letter-box"
        box.className = "letter-box"
        row.appendChild(box)
    }
    board.appendChild(row)
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
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0
        initBoard()
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
    const target = e.target

    if (!target.classList.contains("filled-box")) {
        return
    }else if (target.parentElement.id != ("solver-letter-row-" + (6 - guessesRemaining))) {
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


initBoard()