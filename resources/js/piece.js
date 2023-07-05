class piece {
    constructor(game,id, col, row, img, pieceWidthSize, pieceHeightSize, maxRateX, maxRateY) {
        this.game = game;
        this.id = id;
        this.col = col;
        this.row = row;
        this.pieceWidthSize = pieceWidthSize;
        this.pieceHeightSize = pieceHeightSize;
        this.x = this.col * this.pieceWidthSize;
        this.y = this.row * this.pieceHeightSize;

        this.img = img;
        this.maxRateX = maxRateX;
        this.maxRateY = maxRateY;
    }

    update() {
        let targetX = this.col * this.pieceWidthSize;
        let targetY = this.row * this.pieceHeightSize;
        if (targetX > this.x){
            this.x +=this.maxRateX;
        } else if(targetX < this.x){
            this.x -=this.maxRateX;
        }
        if (targetY > this.y){
            this.y+=this.maxRateY;
        } else if(targetY < this.y){
            this.y-=this.maxRateY;
        }
    }

    draw() {
        this.game.ctx.drawImage(
            this.img,
            0,
            0,
            this.pieceWidthSize,
            this.pieceHeightSize,
            this.x,
            this.y,
            this.pieceWidthSize,
            this.pieceHeightSize
        )
        this.game.ctx.beginPath();
        this.game.ctx.rect(this.x,this.y, this.pieceWidthSize, this.pieceHeightSize);
        this.game.ctx.stroke();
    }
}

export default piece;
