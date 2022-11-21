const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let guessHistory = []
let guessContext = []
let aiSuggestedGuess = ""
let greens = [null, null, null, null, null]
let yellows = []

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
            yellows.push(box.textContent)
        }else{
            contextString += "2"
            greens[i] = box.textContent
        }

        guessString += box.textContent
        shadeKeyBoard(box.textContent, box.style.backgroundColor)
    }

    guessContext.push(contextString)
    guessHistory.push(guessString)

    console.log(greens)

    console.log(yellows)

    postGuess()

    guessesRemaining -= 1
    currentGuess = []
    nextLetter = 0

    if(contextString === "22222"){
        toastr.success("You solved the Wordle, Congrats!")
        guessesRemaining = 0
    }
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
    let board = document.getElementById("solver")
    const target = e.target
    let row = board.children[6 - guessesRemaining] 
    let currentColor = target.style.backgroundColor

    let index = Array.prototype.indexOf.call(row.children, target)

    if (!target.classList.contains("filled-box") && currentColor != "orange") {
        return
    }else if (target.parentElement != row) {
        return
    }

    if (currentColor == "grey") {
        currentColor = "yellow"
        target.style.backgroundColor = currentColor

    }else if (currentColor == "yellow") {
        currentColor = "green"
        target.style.backgroundColor = currentColor

    }else if (currentColor == "green" && greens[index] != target.textContent.toLowerCase()){
        currentColor = "grey"
        target.style.backgroundColor = currentColor

    }else if (currentColor == "orange"){
        for(let i = 0; i < 5; i++){
            animateCSS(row.children[i], "pulse")
            row.children[i].classList.add("filled-box")
            currentGuess.push(row.children[i].textContent.toLowerCase())
            if(row.children[i].textContent.toLowerCase() == greens[i]){
                row.children[i].style.backgroundColor = "green"
            }else if(yellows.includes(row.children[i].textContent.toLowerCase())){
                row.children[i].style.backgroundColor = "yellow"
            }else{
                row.children[i].style.backgroundColor = "grey"
            }
        }
        nextLetter = 5
        console.log(currentGuess)
    }

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