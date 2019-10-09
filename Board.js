"use strict";

class Position {
    constructor(x, y) {
        this.row = x;
        this.col = y;
    }
}


function generateRandomPosition() {
    let x = Math.floor(Math.random() * this.row);
    let y = Math.floor(Math.random() * this.col);
    return new Position(x, y);
}


class Game {

    constructor(row, col, bombs) {
        this.row = row;
        this.col = col;
        this.bombs = bombs;
        this.board = this.defineBoard();

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

            let pos = generateRandomPosition();

            while (this.ifOccupied(pos)) {
                pos = generateRandomPosition();
            }
            this.board[pos.row][pos.col] = "X";
        }
    };

    checkTopBombs(i, j) {
        let bombs = 0;
        if (i - 1 > 0 && this.isBombPlanned(i - 1, j)) {
            ++bombs;
        }

        if (i - 1 > 0 && j - 1 > 0 && this.isBombPlanned(i - 1, j - 1)) {
            ++bombs;
        }

        if (i - 1 > 0 && j + 1 < this.col && this.isBombPlanned(i - 1, j + 1)) {
            ++bombs;
        }
        return bombs;
    };

    checkBottomBombs(i, j) {
        let bombs = 0;
        if (i + 1 < this.row && this.isBombPlanned(i + 1, j)) {
            ++bombs;
        }

        if (i + 1 < this.row && j - 1 > 0 && this.isBombPlanned(i + 1, j - 1)) {
            ++bombs;
        }

        if (i + 1 < this.row && j + 1 < this.col && this.isBombPlanned(i + 1, j + 1)) {
            ++bombs;
        }
        return bombs;
    }

    checkLeftRightBombs(i, j) {
        let bombs = 0;

        if (j - 1 > 0 && this.isBombPlanned(i, j - 1)) {
            ++bombs;
        }

        if (j + 1 > 0 && this.isBombPlanned(i, j + 1)) {
            ++bombs;
        }
        return bombs;
    }

    describeBombs() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.board[i][j] !== "X") {
                    this.board[i][j] = this.checkTopBombs() + this.checkBottomBombs(i, j) + this.checkLeftRightBombs();
                }
            }
        }
    }
}














