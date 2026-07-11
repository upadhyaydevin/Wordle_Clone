const ROWS = 6;
const COLS = 5;
// --- State ---
let currentRow = 0;
let currentCol = 0;
let answer = "";          // we'll load a random word here
const grid = [];          // will hold the tile DOM elements

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

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        submitGuess(); //to be built
    } else if (e.key === "Backspace"){
        deleteLetter(); //to be built
    } else if (/^[a-zA-Z]$/.test(e.key)){
        addLetter(e.key.toUpperCase()); //to be built
    }
});