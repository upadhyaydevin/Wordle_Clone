const ROWS = 6;
const COLS = 5;
// --- State ---
let currentRow = 0;
let currentCol = 0;
let validWords = []
let validAnswers = []
let answer = ""
let gameOver = false
let animating = false
const keyColors = {}
const grid = []            // will hold the tile DOM elements
const rows = []            // holds row DOM elements

async function loadWords(){
    const responseValid = await fetch("valid-words.txt")
    const responseAnswer = await fetch("correct-answers.txt")
    const answerText = await responseAnswer.text()
    const wordsText = await responseValid.text()
    validAnswers = answerText.split("\n")
    const N = validAnswers.length
    let answerIndex = Math.floor(Math.random()*N)
    answer = validAnswers[answerIndex].trim()
    console.log(answer)
    validAnswers = new Set(validAnswers)

    validWords = wordsText.split("\n")
    validWords = new Set(validWords)
    document.addEventListener("keydown", handleKey);
}

// builds the board
function createBoard() {
    const board = document.getElementById("board")
    for (let r=0; r<ROWS; r++){
        const row = document.createElement("div")
        row.className = "row"
        let rowCells = []
        for (let c=0; c<COLS; c++){
            const cell = document.createElement("div")
            cell.className = "cell"
            row.appendChild(cell)
            rowCells.push(cell)
        }
        board.appendChild(row)
        grid.push(rowCells)
        rows.push(row)
    }
}
function addLetter(letter){
    if (currentCol < COLS){
        grid[currentRow][currentCol].textContent = letter
        currentCol++
    }
}
function deleteLetter(){
    if (currentCol != 0){
        grid[currentRow][currentCol-1].textContent = ""
        currentCol--
    }
}

function validWord(checkWord){
    return validWords.has(checkWord.toLowerCase())
}

function color(checkWord){
    checkWord = checkWord.toLowerCase()
    let counts = new Map()
    let resultColor = []
    for (let j=0; j<5; j++){
        counts.set(answer[j], (counts.get(answer[j]) || 0) + 1)
    }
    for (let i=0; i<5; i++){
        if (answer[i] == checkWord[i]){
            resultColor[i] = "green"
            counts.set(checkWord[i], counts.get(checkWord[i]) - 1)
        }
    }
    for (let k=0; k<5; k++){
        if (resultColor[k] == "green"){
            continue
        }
        if (counts.get(checkWord[k]) > 0){
            resultColor[k] = "yellow"
            counts.set(checkWord[k], counts.get(checkWord[k]) - 1)
        }
        else{
            resultColor[k] = "gray"
        }
    }
    return resultColor
}

function revealRow(resultColor, row, word){
    for (let i = 0; i < COLS; i++){
        setTimeout(() => {
            grid[row][i].classList.add(resultColor[i])
            updateKeyColor(word[i], resultColor[i]);
        }, i * 300)
    }
}

function submitGuess(){
    let word = ""
    if (gameOver) return
    
    if (currentCol == COLS){
        for (let c=0; c<COLS; c++){
            word += grid[currentRow][c].textContent
        }
        if (validWord(word) == true){
            let resultColor = color(word)
            animating = true
            revealRow(resultColor, currentRow, word)
            setTimeout(() => {animating = false}, COLS * 300)
            currentRow++
            currentCol = 0

            let didWin = (word.toLowerCase() === answer)
            let revealTime = COLS * 300   // wait for the cascade to finish

            if (didWin){
                gameOver = true
                setTimeout(() => alert(`You got Wordle in ${currentRow}!`), revealTime)
            } else if (currentRow === ROWS){
                gameOver = true
                setTimeout(() => alert(`Game over! The word was ${answer.toUpperCase()}`), revealTime)
            }
        }else{
            showToast("Not in word list")
            rows[currentRow].classList.add('shake')
            setTimeout(()=> {rows[currentRow].classList.remove('shake')}, 800)
        }
    }
}

function showToast(message){
    const toast = document.getElementById("toast")
    toast.textContent = message
    toast.classList.add('visible')
    setTimeout(()=> {toast.classList.remove('visible')}, 1200)
}

function handleKey(e) {
    if (gameOver == false && animating == false){
        if (e.key === "Enter") {
        submitGuess();
        } else if (e.key === "Backspace") {
        deleteLetter();
        } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
    }
    }
    
}

const row1 = ["Q","W","E","R","T","Y","U","I","O","P"]
const row2 = ["A","S","D","F","G","H","J","K","L"]
const row3 = ["ENTER","Z","X","C","V","B",'N','M','DELETE']
const keyboardRows = [row1, row2, row3]

function createKeyboard(){
    let keyboard = document.getElementById('keyboard')
    for (const row of keyboardRows){
        const keyboardRow = document.createElement('div')
        keyboardRow.className = 'keyboard-row'
        keyboard.appendChild(keyboardRow)
        for (const element of row){
            const key = document.createElement('button')
            key.className = 'key'
            key.textContent = element
            if (element === 'ENTER' || element === 'DELETE'){
                key.classList.add('key-special')
            }
            key.dataset.key = element // now it looks like <button class="key" data-key="A"> A </button>
            keyboardRow.append(key)
            key.addEventListener('click', ()=>{
                if (gameOver == false && animating == false){
                    if (element === 'ENTER'){submitGuess()}
                    else if (element === 'DELETE'){deleteLetter()}
                    else addLetter(element)
                }
            })
        }
    }
}

function updateKeyColor(letter, newColor){
    letter = letter.toUpperCase();
    const ranks = {'green': 3, 'yellow': 2, 'gray': 1}
    currentRank = ranks[keyColors[letter]] || 0
    newRank = ranks[newColor] || 0
    if (newRank > currentRank){
        keyColors[letter] = newColor
        const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement) {
            // Remove any old color classes before applying the higher rank class
            keyElement.classList.remove("green", "yellow", "gray");
            keyElement.classList.add(newColor)
        }
    }
}
createBoard();
loadWords();
createKeyboard();