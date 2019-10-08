class Position{
    constructor(x ,y)
    {
        this.row = x;
        this.col = y;
    }
}

let game = {
    board : null,
    row : 9,
    col : 9,
    bombs : 10,
};


function defineBoard(x,y){
    game.board = new Array(x);
    for (let i = 0; i < x; i++) {
        game.board[i] = new Array(y);
    }
    game.row = x;
    game.col = y;
}

function setBombs(x,y)
{
    for (let i = 0; i < ; i++) {

    }
}












