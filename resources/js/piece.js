class piece {
    constructor(game,id, col, row, img, pieceSize) {
        this.game = game;
        this.id = id;
        this.col = col;
        this.row = row;
        this.pieceSize = pieceSize;
        this.x = this.col * this.pieceSize;
        this.y = this.row * this.pieceSize;

        this.img = img;
    }

    update() {
        let targetX = this.col * this.pieceSize;
        let targetY = this.row * this.pieceSize;
        if (targetX > this.x){
            this.x +=5;
        } else if(targetX < this.x){
            this.x -=5;
        }
        if (targetY > this.y){
            this.y+=5;
        } else if(targetY < this.y){
            this.y-=5;
        }
    }

    draw() {
        this.game.ctx.drawImage(
            this.img,
            0,
            0,
            this.pieceSize,
            this.pieceSize,
            this.x,
            this.y,
            this.pieceSize,
            this.pieceSize
        )
        this.game.ctx.beginPath();
        this.game.ctx.rect(this.x,this.y, this.pieceSize, this.pieceSize);
        this.game.ctx.stroke();
    }
}

export default piece;
