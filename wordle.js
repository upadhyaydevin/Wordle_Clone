const ROWS = 6;
const COLS = 5;
// --- State ---
let currentRow = 0;
let currentCol = 0;
let validWords = []
let validAnswers = []
let answer = ""
const grid = [];          // will hold the tile DOM elements

async function loadWords(){
    const responseValid = await fetch("valid-loadWords.txt")
    const responseAnswer = await fetch("correct-answers.txt")
    const answerText = await responseAnswer.text()
    const wordsText = await responseValid.text()
    validAnswers = answerText.split("\n")
    const N = validAnswers.length
    let answerIndex = Math.floor(Math.random()*N)
    answer = validAnswers[answerIndex].trim()
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
    

}

function submitGuess(){
    let word = ""
    if (currentCol == COLS){
        for (let c=0; c<COLS; c++){
            word += grid[currentRow][c].textContent
        }
        if (validWord(word) == true){
            color(word)
            currentRow++
            currentCol = 0
        }
    }
}

function handleKey(e) {
  if (e.key === "Enter") {
    submitGuess();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
}

createBoard();
loadWords();

