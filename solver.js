let aiGuessContext = []

function initBoard(boardName) {
    let board = document.getElementById(boardName)

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

// Delete letter from box
function deleteLetter() {
    let row = document.getElementById("solver").children[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}




initBoard("solver")