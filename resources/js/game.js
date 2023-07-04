import piece from "./piece";

(function ($) {
    "use strict";
    var AppGame = function AppGame(element, options, cb) {
        var appGame = this;
        this.element = element;
        this.$element = $(element);
        this.appUrl = _url;
        this.token = _token;
        this.gameWidth = 390;
        this.gameHeight = 520;
        this.pieceSize = 130;
        this.pathImage = '';
        this.rateImage = 0;
        this.canvas;
        this.ctx;
        this.img = null;
        this.pieces = [];
        this.defaultPieces = [];
        this.selectedPiece = {};
        this.emptyPiece = {row: 0, col: 0};
        this.timeStart = 30;
        this.$element.on('click', '.check', function () {
            appGame.checkWin();
        });
        this.$element.on('click', '.reset', function () {
            appGame.resetGame();
        });
    };

    AppGame.prototype = {
        _init: function _init() {
            this.ajaxSetup();
            this.init();
            this.loadImage();
            this.loop();
            this.listenMouseEvent();
            this.checkTime();
        },
        ajaxSetup: function ajaxSetup() {
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": _token
                }
            });
        },
        init: function () {
            var el = this;
            var selectedImage = localStorage.getItem('choose_image');
            if (selectedImage) {
                selectedImage = JSON.parse(selectedImage);
                el.pathImage = selectedImage.path_image;
                el.gameWidth = selectedImage.width_image;
                el.gameHeight = selectedImage.height_image;
                el.pieceSize = selectedImage.piece_image;
                el.rateImage = selectedImage.rate_image;
                $('#sample-image').attr('src', el.appUrl + '/puzzle/show-image/' + el.pathImage);
                el.canvas = document.getElementById('canvas');
                el.ctx = el.canvas.getContext('2d');
                el.canvas.width = el.gameWidth;
                el.canvas.height = el.gameHeight;
                $('.card-body').append(el.canvas);
                $('.card-puzzle').css({
                    'width': el.gameWidth + 'px',
                });
            } else {
                window.location.replace(el.appUrl);
            }
        },
        loadImage: function () {
            var el = this;
            this.img = new Image();
            this.img.onload = () => {
                this.startGame();
            }
            this.img.src = 'puzzle/show-image/' + el.pathImage;
        },
        startGame: function () {
            //create pieces
            var el = this;
            var rows = [];
            for (let i = 0; i < el.rateImage; i++) {
                var col = [];
                for(let j = 0; j < el.rateImage; j++) {
                    col.push(null);
                }
                rows.push(col);
            }

            var row = [];
            var addRow = 0;
            do {
                row.push(null);
                addRow += 1;
            } while (addRow < el.rateImage);

            el.defaultPieces = rows;

            rows.push(row);
            el.pieces = rows;

            for (let row = 0; row < el.pieceSize; row++) {
                for (let col = 0; col < el.pieceSize; col++) {
                    let pieceCanvas = document.createElement('canvas');
                    pieceCanvas.width = this.pieceSize;
                    pieceCanvas.height = this.pieceSize;
                    let pieceCtx = pieceCanvas.getContext('2d');

                    pieceCtx.drawImage(
                        this.img,
                        col * this.pieceSize,
                        row * this.pieceSize,
                        this.pieceSize,
                        this.pieceSize,
                        0,
                        0,
                        this.pieceSize,
                        this.pieceSize
                    );
                    //create pieces
                    let newPiece = new piece(this, row * el.rateImage + col, col, row + 1, pieceCanvas, this.pieceSize);
                    this.pieces[row + 1][col] = newPiece;
                    this.defaultPieces[row][col] = newPiece.id;
                }
            }
            //random game
            for (let randomTime = 0; randomTime < 100; randomTime++) {
                this.randomMove();
            }

        },
        randomMove: function () {
            var el = this;
            let r = Math.round(Math.random() * el.rateImage);
            let willMove = null;
            switch (r) {
                case 0:
                    if (this.emptyPiece.row > 2) {
                        willMove = {row: this.emptyPiece.row - 1, col: this.emptyPiece.col};
                    }
                    break;
                case 1:
                    if (this.emptyPiece.row < 3) {
                        willMove = {row: this.emptyPiece.row + 1, col: this.emptyPiece.col};
                    }
                    break;
                case 2:
                    if (this.emptyPiece.col > 0) {
                        willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col - 1};
                    }
                    break;
                case 3:
                    if (this.emptyPiece.col < 2 && this.emptyPiece.row > 1) {
                        willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col + 1};
                    }
                    break;
            }

            if (willMove !== null) {
                this.swapPiece(willMove, this.emptyPiece);
            }
        },
        swapPiece: function (piece1, piece2) {
            this.pieces[piece2.row][piece2.col] = this.pieces[piece1.row][piece1.col];
            this.pieces[piece1.row][piece1.col] = null;
            this.pieces[piece2.row][piece2.col].row = piece2.row;
            this.pieces[piece2.row][piece2.col].col = piece2.col;
            this.emptyPiece = piece1;
        },
        loop: function () {
            this.update();
            this.draw();
            setTimeout(() => {
                this.loop();
            }, 20);
        },
        update: function () {
            this.pieces.forEach(row => {
                row.forEach(piece => {
                    if (piece !== null) {
                        piece.update();
                    }
                });
            });
        },
        draw: function () {
            //clear screen
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
            this.pieces.forEach(row => {
                row.forEach(piece => {
                    if (piece !== null) {
                        piece.draw();
                    }
                });
            });
        },
        listenMouseEvent: function () {
            this.canvas.addEventListener('mousedown', (event) => this.mouseDown(event));
            this.canvas.addEventListener('mouseup', (event) => this.mouseUp(event));
        },
        mouseDown: function (event) {
            let mousePos = this.getMousePos(event);
            this.selectedPiece = this.getCorByMousePosition(mousePos);
        },
        mouseUp: function (event) {
            let mousePos = this.getMousePos(event);
            let mouseUpCor = this.getCorByMousePosition(mousePos);
            if (
                mouseUpCor.row !== this.emptyPiece.row ||
                mouseUpCor.col !== this.emptyPiece.col
            ) {
                return;
            }

            if (
                (
                    this.selectedPiece.row === this.emptyPiece.row &&
                    (this.selectedPiece.col - 1 === this.emptyPiece.col || this.selectedPiece.col + 1 === this.emptyPiece.col)
                )
                ||
                (
                    this.selectedPiece.col === this.emptyPiece.col &&
                    (this.selectedPiece.row - 1 === this.emptyPiece.row || this.selectedPiece.row + 1 === this.emptyPiece.row)
                )
            ) {
                //swap object in data
                this.swapPiece(this.selectedPiece, mouseUpCor);
            }
        },
        getMousePos: function (event) {
            var rect = this.canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        },
        getCorByMousePosition: function (mousePos) {
            return {
                col: Math.floor(mousePos.x / this.pieceSize),
                row: Math.floor(mousePos.y / this.pieceSize),
            }
        },
        resetGame: function () {
            window.location.replace(this.appUrl + '/puzzle');
        },
        checkWin: function () {
            let check = true;
            for (let i = 0; i < this.defaultPieces.length - 1; i++) {
                for (let j = 0; j < this.defaultPieces.length; j++) {
                    if (this.pieces[i + 1][j] != null) {
                        if (this.defaultPieces[i][j] !== this.pieces[i + 1][j].id) {
                            check = false;
                            break;
                        }
                    }
                }
            }
            if (check) {
                window.location.replace(this.appUrl);
            } else {
                alert('Chưa đúng');
            }
        },
        checkTime: function () {
            $('#time').val("00:" + this.timeStart);
            setInterval(() => {
                this.timeStart -= 1;
                // does the same job as parseInt truncates the float
                let minutes = (this.timeStart / 60) | 0;
                let seconds = (this.timeStart % 60) | 0;

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $('#time').val(minutes + ":" + seconds);
                if (this.timeStart === 0) {
                    window.location.replace(this.appUrl + '/puzzle');
                }
            }, 1000);
        }
    };

    $.fn.appGame = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (!el.data("appGame")) {
                var appGame = new AppGame(el, options, cb);
                el.data("appGame", AppGame);
                appGame._init();
            }
        });
        return this;
    };

})(jQuery);

$(document).ready(function () {
    $("body").appGame();
});

