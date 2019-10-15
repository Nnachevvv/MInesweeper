"use strict";





class Game {

    constructor(row, col, bombs) {
        this.row = row;
        this.col = col;
        this.cellsToWin = row * col - bombs;
        this.bombsLeft = bombs;
        this.isGameFinished = false;
        this.bombsPositions = new Set([]);
        this.defineBoard();
        this.stopwatch = new StopWatch();
    };

    startGame(ROWS =  8, COLS = 8, BOMBS = 10 ) {
        document.getElementById("face").src = 'images/bored.gif';
        game.stopwatch.stopInterval();
        game = new Game(ROWS, COLS,  BOMBS);
    }

    defineBoard() {
        this.clearTable();
        this.board = new Array(this.row);
        for (let i = 0; i < this.col; i++) {
            this.board[i] = new Array(this.col);
        }
        this.setBombs();
        this.describeCells();
        this.bombUpdateHtml();
    };


    clearTable() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {

                document.getElementById("tableId").rows[i + 1].cells[j].innerText = " ";
                document.getElementById("tableId").rows[i + 1].cells[j].style.backgroundColor = "gainsboro";
                document.getElementById("tableId").rows[i + 1].cells[j].style.pointerEvents = 'auto';
            }
        }
        let el = document.getElementById("timer");
        el.innerText = 0 + " ";
    };



     bombUpdateHtml() {
        document.getElementById('bombsLeft').innerText = this.bombsLeft + "";
    }

    ifOccupied(pos) {
        return this.board[pos.row][pos.col];
    };

    isBombPlanned(i, j) {
        return this.board[i][j] === "X";
    }

    setBombs() {
        for (let i = 0; i < this.bombsLeft; i++) {

            let pos = generateRandomPosition(this.row, this.col);

            while (this.ifOccupied(pos)) {
                pos = generateRandomPosition(this.row, this.col);
            }

            this.board[pos.row][pos.col] = "X";
            this.bombsPositions.add(pos.row + " " + pos.col);

        }
    };

    countOfTopBombs(i, j) {
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

    countOfBottomBombs(i, j) {
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
    };

    CountOfLeftAndRightBombs(i, j) {
        let bombs = 0;

        if (j - 1 >= 0 && this.isBombPlanned(i, j - 1)) {
            ++bombs;
        }

        if (j + 1 >= 0 && this.isBombPlanned(i, j + 1)) {
            ++bombs;
        }

        return bombs;
    };

    describeCells() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.board[i][j] !== "X") {
                    this.board[i][j] = this.countOfTopBombs(i, j) + this.countOfBottomBombs(i, j) + this.CountOfLeftAndRightBombs(i, j);
                }
            }
        }
    };

    checkForWin() {
        if (this.cellsToWin <= 0) {
            this.markBombs('!');
            document.getElementById("face").src = 'images/happy.gif';
            return true;
        }
    };

    gameOverClick()
    {
        this.stopwatch.stopInterval();
        this.markBombs();
        this.isGameFinished = true;
        document.getElementById("face").src = 'images/sad.gif';
    };

    rightClickMouse(click)
    {
        if (click.innerText === '?') {
            click.innerText = '!';
            ++this.bombsLeft;
            this.bombUpdateHtml();
        }else if(click.innerText === '!')
        {
            click.innerText = null;
        }
        else {
            click.innerText = '?';
            --this.bombsLeft;
            this.bombUpdateHtml();
        }
    };

    leftClickMouse(click)
    {
        click.style.pointerEvents = 'none';
        let rowClicked = click.parentNode.rowIndex - 1;
        let colClicked = click.cellIndex;
        if (this.board[rowClicked][colClicked] === 0) {
            this.clearZeroCells(rowClicked,colClicked);
        }else if(this.board[rowClicked][colClicked] !== 'X'){
            --this.cellsToWin;
            click.innerText = this.board[rowClicked][colClicked];
            click.style.backgroundColor = "rgb(169,169, 169)\n";
        }
        if (this.board[rowClicked][colClicked] === "X") {
            this.gameOverClick();
        } else if (!this.stopwatch.timerStarted) {
            this.stopwatch.startTime();
        }
    };



    showCell(click, event) {
        event.preventDefault();
        if (!this.isGameFinished) {

            if (event.button === 0) {
                this.leftClickMouse(click);
            } else {
                this.rightClickMouse(click);
            }
        }
        if (this.checkForWin()) {
            this.isGameFinished = true;
            this.bombsLeft = 0;
            this.stopwatch.stopInterval();
        }
    };

    markBombs(symbol = 'X') {
        for (let bomb of this.bombsPositions.values()) {
            bomb = bomb.split(" ");
            let row = Number(bomb[0]);
            let col = Number(bomb[1]);
            let element = document.getElementById("tableId").rows[row + 1].cells[col];
            element.innerText = symbol;
                if(symbol === 'X')
            {
                element.style.backgroundColor = "rgb(169,169, 169)\n";
            }

        }
    };




    IsTableCellEmpty(row , col)
    {
        return !document.getElementById("tableId").rows[row + 1].cells[col].innerText;
    }

    clearZeroCells(row , col)
    {
        if(row < 0 || row >= this.row  || col < 0 || col >= this.col)
        {
            return;
        }
        document.getElementById("tableId").rows[row+1].cells[col].innerText = this.board[row][col];
        document.getElementById("tableId").rows[row+1].cells[col].style.backgroundColor = "rgb(169,169, 169)\n";
        --this.cellsToWin;
        if(this.board[row][col] !== 0)
        {
            return;
        }

        if(row - 1 >= 0 && this.IsTableCellEmpty(row - 1,col) ){
            this.clearZeroCells(row - 1 , col)
        }

        if(col - 1 >= 0 && this.IsTableCellEmpty(row,col-1) )
        {
            this.clearZeroCells(row,col-1);
        }


        if(row + 1 < this.row && this.IsTableCellEmpty(row + 1,col))
        {
            this.clearZeroCells(row + 1,col);
        }

        if(col + 1 < this.col && this.IsTableCellEmpty(row,col+1))
        {
            this.clearZeroCells(row ,col+1);
        }

        if(row - 1 >= 0 && col - 1 >= 0 && this.IsTableCellEmpty(row - 1,col - 1))
        {
            this.clearZeroCells(row - 1 , col - 1 );
        }

        if(row + 1 < this.row && col + 1 < this.col && this.IsTableCellEmpty(row + 1,col + 1))
        {
            this.clearZeroCells(row + 1 , col + 1 );
        }

        if(row + 1 < this.row && col - 1 >=  0  && this.IsTableCellEmpty(row+1,col-1))
        {
            this.clearZeroCells(row + 1 , col - 1 );
        }

        if(row - 1 >= 0  && col + 1 < this.col && this.IsTableCellEmpty(row-1,col+1))
        {
            this.clearZeroCells(row - 1 , col + 1 );
        }
    }

}

let game = new Game(8, 8, 10);




