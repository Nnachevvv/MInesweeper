"use strict";

class StopWatch {
    constructor() {

        this.timerStarted = false;

    }

    startTime() {
        this.timerStarted = true;
        let seconds = 0;
        let el = document.getElementById("timer");
           function  startInterval() {
            seconds += 1;
            el.innerHTML = seconds+ " ";
        }
        this.cancel = setInterval(startInterval, 1000);

    }

    stopInterval() {
        this.timerStarted = false;
         clearInterval(this.cancel);
    }

}


function bombUpdateHtml() {
    document.getElementById('bombsLeft').innerText = game.bombsPositions.size + "";

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
        this.bombs = bombs;
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

    showBlock(event) {
        let rowClicked = event.parentNode.rowIndex - 1;
        let colClicked = event.cellIndex;
        event.innerHTML = this.board[rowClicked][colClicked];
        if (this.board[rowClicked][colClicked] === "X") {
            this.stopwatch.stopInterval();
            this.showBombs();
        } else if (!this.stopwatch.timerStarted) {

            this.stopwatch.startTime();
        }
    }

    showBombs() {
        for (let bomb of this.bombsPositions.values()) {
            bomb = bomb.split(" ");
            let row = Number(bomb[0]);
            let col = Number(bomb[1]);
            let x = document.getElementById("tableId").rows[row + 1].cells[col].innerText = this.board[row][col];
        }
    }

}


let game = new Game(9, 9, 10);
bombUpdateHtml();

