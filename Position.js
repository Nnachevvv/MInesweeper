
function generateRandomPosition(maxCol, maxRow) {
    let x = Math.floor(Math.random() * maxCol);
    let y = Math.floor(Math.random() * maxRow);
    return new Position(x, y);
}

class Position {
    constructor(x, y) {
        this.row = x;
        this.col = y;
    }
}

