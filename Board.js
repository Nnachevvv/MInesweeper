"use strict";
let DEFAULT_ROWS = 8;
let DEFAULT_COLS = 8;


class StopWatch {
    constructor() {

        this.timerStarted = false;

    }

    startTime() {
        this.timerStarted = true;
        let seconds = 0;
        let el = document.getElementById("timer");

        function startInterval() {
            seconds += 1;
            el.innerHTML = seconds + " ";
        }

        this.cancel = setInterval(startInterval, 1000);

    }

    stopInterval() {
        this.timerStarted = false;
        clearInterval(this.cancel);
    }

}


function bombUpdateHtml() {
    document.getElementById('bombsLeft').innerText = game.bombsLeft + "";

}


class Position {
    constructor(x, y) {
        this.row = x;
        this.col = y;
    }
}

function generateRandomPosition(maxCol, maxRow) {
    let x = Math.floor(Math.random() * maxCol);
    let y = Math.floor(Math.random() * maxRow);
    return new Position(x, y);
}


class Game {

    constructor(row, col, bombs) {
        this.row = row;
        this.col = col;
        this.cellsToWin = row * col - bombs;
        this.bombs = bombs;
        this.bombsLeft = bombs;
        this.isGameFinished = false;
        this.bombsPositions = new Set([]);
        this.defineBoard();
        this.stopwatch = new StopWatch();
    };

    defineBoard() {
        this.board = new Array(this.row);
        for (let i = 0; i < this.col; i++) {
            this.board[i] = new Array(this.col);
        }
        this.setBombs();
        this.describeBombs();
    };

    ifOccupied(pos) {
        return this.board[pos.row][pos.col];
    };

    isBombPlanned(i, j) {
        return this.board[i][j] === "X";
    }

    setBombs() {
        for (let i = 0; i < this.bombs; i++) {

            let pos = generateRandomPosition(this.row, this.col);

            while (this.ifOccupied(pos)) {
                pos = generateRandomPosition(this.row, this.col);
            }
            this.board[pos.row][pos.col] = "X";
            this.bombsPositions.add(pos.row + " " + pos.col);
        }
    };

    checkTopBombs(i, j) {
        let bombs = 0;
        if (i - 1 >= 0 && this.isBombPlanned(i - 1, j)) {
            ++bombs;
        }

        if (i - 1 >= 0 && j - 1 >= 0 && this.isBombPlanned(i - 1, j - 1)) {
            ++bombs;
        }

        if (i - 1 >= 0 && j + 1 < this.col && this.isBombPlanned(i - 1, j + 1)) {
            ++bombs;
        }
        return bombs;
    };

    checkBottomBombs(i, j) {
        let bombs = 0;
        if (i + 1 < this.row && this.isBombPlanned(i + 1, j)) {
            ++bombs;
        }

        if (i + 1 < this.row && j - 1 >= 0 && this.isBombPlanned(i + 1, j - 1)) {
            ++bombs;
        }

        if (i + 1 < this.row && j + 1 < this.col && this.isBombPlanned(i + 1, j + 1)) {
            ++bombs;
        }
        return bombs;
    }

    checkLeftRightBombs(i, j) {
        let bombs = 0;

        if (j - 1 >= 0 && this.isBombPlanned(i, j - 1)) {
            ++bombs;
        }

        if (j + 1 >= 0 && this.isBombPlanned(i, j + 1)) {
            ++bombs;
        }

        return bombs;
    }

    describeBombs() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.board[i][j] !== "X") {
                    this.board[i][j] = this.checkTopBombs(i, j) + this.checkBottomBombs(i, j) + this.checkLeftRightBombs(i, j);
                }
            }
        }
    }

    checkForWin() {

        if (this.cellsToWin <= 0) {
            this.showBombs('!');
            document.getElementById("face").src = 'happy.gif';
            return true;
        }
    }

    gameOverClick()
    {
        this.stopwatch.stopInterval();
        this.showBombs();
        this.isGameFinished = true;
        document.getElementById("face").src = 'sad.gif';
    }

    rightClickMouse(click)
    {
        if (click.innerHTML === '?') {

            click.innerHTML = '!';
            ++this.bombsLeft;
            bombUpdateHtml();
        }else if(click.innerHTML === '!')
        {
            click.innerHTML = null;
        }
        else {
            click.innerHTML = '?';
            --this.bombsLeft;
            bombUpdateHtml();
        }
    }

    showBlock(click, event) {
        event.preventDefault();
        if (!this.isGameFinished) {
            let rowClicked = click.parentNode.rowIndex - 1;
            let colClicked = click.cellIndex;
            click.style.pointerEvents = 'none';
            if (event.button === 0) {
                --this.cellsToWin;
                click.innerHTML = this.board[rowClicked][colClicked];
                click.style.backgroundColor = "rgb(169,169, 169)\n";
                if (this.board[rowClicked][colClicked] === "X") {
                    this.gameOverClick();
                } else if (!this.stopwatch.timerStarted) {
                    this.stopwatch.startTime();
                }
            } else {
                this.rightClickMouse(click);
            }
        }
        if (this.checkForWin()) {
            this.isGameFinished = true;
        }
    }

    showBombs(symbol = 'X') {
        for (let bomb of this.bombsPositions.values()) {
            bomb = bomb.split(" ");
            let row = Number(bomb[0]);
            let col = Number(bomb[1]);
            document.getElementById("tableId").rows[row + 1].cells[col].innerText = symbol;
                if(symbol === 'X')
            {
                document.getElementById("tableId").rows[row + 1].cells[col].style.backgroundColor = "rgb(169,169, 169)\n";
            }

        }
    }

}

let game = new Game(DEFAULT_ROWS, DEFAULT_COLS, 10);
bombUpdateHtml();

function clearTable() {
    for (let i = 0; i < DEFAULT_ROWS; i++) {
        for (let j = 0; j < DEFAULT_COLS; j++) {

            document.getElementById("tableId").rows[i + 1].cells[j].innerText = " ";
            document.getElementById("tableId").rows[i + 1].cells[j].style.backgroundColor = "gainsboro";
            document.getElementById("tableId").rows[i + 1].cells[j].style.pointerEvents = 'auto';
        }
    }
    let el = document.getElementById("timer");
    el.innerHTML = 0 + " ";
}

function startGame() {
    document.getElementById("face").src = 'bored.gif';
    game.stopwatch.stopInterval();
    game = new Game(8, 8, 10);
    bombUpdateHtml();
    clearTable();
}

