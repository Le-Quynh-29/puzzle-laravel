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
        this.pieceWidthSize = 130;
        this.pieceHeightSize = 130;
        this.pathImage = '';
        this.rateWidthImage = 0;
        this.rateHeightImage = 0;
        this.canvas;
        this.ctx;
        this.img = null;
        this.pieces = [];
        this.defaultPieces = [];
        this.selectedPiece = {};
        this.emptyPiece = {row: 0, col: 0};
        this.timeStart = 15;
        this.maxLevel = _maxLevel;
        this.maxRateX = 0;
        this.maxRateY = 0;
        this.level = 1;
        this.checkResetOrExit = '';
        this.setIntervalTime;
        this.checkTimeCalculation = '';
        this.setTimeCalculation = '';
        this.$element.on('click', '.check', function () {
            appGame.checkWin();
        });
        this.$element.on('click', '.reset', function () {
            appGame.resetGame();
        });
        this.$element.on('click', '.previous', function () {
            appGame.redirectPageChooseImage();
        });
        this.$element.on('click', '#exit', function () {
            appGame.exitGame();
        });
        this.$element.on('click', '#modal-notification .close-modal', function () {
            appGame.hideModalNotification();
        });
        this.$element.on('click', '#modal-confirm .cancel', function () {
            appGame.checkHideModalOrRedirectPage();
        });
        this.$element.on('click', '#modal-confirm .close', function () {
            appGame.hideModalConfirm();
        });
        this.$element.on('click', '#modal-confirm .btn-modal-save', function () {
            appGame.resetOrExitGame();
        });
        this.$element.on('click', '#pause', function () {
            appGame.showModalPause();
        });
        this.$element.on('click', '#modal-game .close', function () {
            appGame.hideModalGame();
        });
        this.$element.on('click', '#modal-game #continue', function () {
            appGame.hideModalGame();
        });
        this.$element.on('click', '#modal-game #play-again', function () {
            appGame.resetWhenTimeOut();
        });
        this.$element.on('click', '#modal-game #exit', function () {
            appGame.exitGameTimeOutOrPause();
        });
    };

    AppGame.prototype = {
        _init: function _init() {
            this.ajaxSetup();
            this.init();
            this.checkLevel();
            this.setPieces();
            this.setDefaultPieces();
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
                el.pieceWidthSize = selectedImage.piece_width_image;
                el.pieceHeightSize = selectedImage.piece_height_image;
                el.rateWidthImage = selectedImage.rate_width_image;
                el.rateHeightImage = selectedImage.rate_height_image;
                el.level = selectedImage.level;
                el.checkTimeCalculation = selectedImage.check_time_calculation;
                el.setTimeCalculation = selectedImage.time_calculation;
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
                window.location.replace(this.appUrl);
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
            var el = this;
            for (let row = 0; row < el.rateHeightImage; row++) {
                for (let col = 0; col < el.rateWidthImage; col++) {
                    let pieceCanvas = document.createElement('canvas');
                    pieceCanvas.width = this.pieceWidthSize;
                    pieceCanvas.height = this.pieceHeightSize;
                    let pieceCtx = pieceCanvas.getContext('2d');

                    pieceCtx.drawImage(
                        el.img,
                        col * el.pieceWidthSize,
                        row * el.pieceHeightSize,
                        el.pieceWidthSize,
                        el.pieceHeightSize,
                        0,
                        0,
                        el.pieceWidthSize,
                        el.pieceHeightSize
                    );
                    //create pieces
                    el.maxRateX = el.maxRate(el.pieceWidthSize);
                    el.maxRateY = el.maxRate(el.pieceHeightSize);

                    let newPiece = new piece(this, row * 3 + col, col, row + 1, pieceCanvas, el.pieceWidthSize,
                        el.pieceHeightSize, el.maxRateX, el.maxRateY);
                    el.pieces[row + 1][col] = newPiece;
                    el.defaultPieces[row][col] = newPiece.id;
                }
            }
            //random game
            var level = el.checkLevel();
            var randomLevel = level.random_move;
            el.timeStart = level.time;
            for (let randomTime = 0; randomTime < randomLevel; randomTime++) {
                this.randomMove();
            }
        },
        randomMove: function () {
            var el = this;
            let r = Math.round(Math.random() * 3);
            let willMove = null;
            switch (r) {
                case 0:
                    if (this.emptyPiece.row > 2) {
                        willMove = {row: this.emptyPiece.row - 1, col: this.emptyPiece.col};
                    }
                    break;
                case 1:
                    if (this.emptyPiece.row < el.rateHeightImage) {
                        willMove = {row: this.emptyPiece.row + 1, col: this.emptyPiece.col};
                    }
                    break;
                case 2:
                    if (this.emptyPiece.col > 0) {
                        willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col - 1};
                    }
                    break;
                case 3:
                    if (this.emptyPiece.col < (el.rateWidthImage - 1) && this.emptyPiece.row > 1) {
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
            this.canvas.addEventListener('touchstart', (event) => this.touchStart(event));
            this.canvas.addEventListener('touchend', (event) => this.touchEnd(event));
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
                col: Math.floor(mousePos.x / this.pieceWidthSize),
                row: Math.floor(mousePos.y / this.pieceHeightSize),
            }
        },
        touchStart: function (event) {
            let mousePos = this.getTouchPos(event);
            this.selectedPiece = this.getCorByTouchPosition(mousePos);
        },
        touchEnd: function (event) {
            let mousePos = this.getTouchPos(event);
            let mouseUpCor = this.getCorByTouchPosition(mousePos);
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
        getTouchPos: function (event) {
            var rect = this.canvas.getBoundingClientRect();
            return {
                x: event.changedTouches[0].clientX - rect.left,
                y: event.changedTouches[0].clientY - rect.top
            };
        },
        getCorByTouchPosition: function (mousePos) {
            return {
                col: Math.floor(mousePos.x / this.pieceWidthSize),
                row: Math.floor(mousePos.y / this.pieceHeightSize),
            }
        },
        resetGame: function () {
            $('#modal-confirm .modal-title').text('Sắp xếp lại vị trí');
            $('#modal-confirm .modal-body').text('Bạn có chắc muốn sắp xếp lại vị trí các mảnh ghép không?');
            $('#modal-confirm').modal('show');
            this.checkResetOrExit = 'reset';
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
                $('#modal-confirm .modal-title').text('Thông báo');
                $('#modal-confirm .modal-body').html(`<p class="color-success"><b>Chính xác</b></p>
                                                    <b>Bạn có muốn tiếp tục trò chơi với ảnh khác không?</b>`);
                $('#modal-confirm').modal('show');
                this.checkResetOrExit = 'finish-image';
            } else {
                $('#modal-notification .modal-title').text('Thông báo');
                $('#modal-notification .modal-body').html(`<p class="color-error"><b>Chưa chính xác</b></p>`);
                $('#modal-notification').modal('show');
            }
        },
        checkTime: function () {
            var el = this;
            if (el.checkTimeCalculation === "yes") {
                $('#time-calculation').removeClass('d-none');
                $('#btn-pause').removeClass('d-none');
                el.intervalTime();
            } else {
                $('#time-calculation').addClass('d-none');
                $('#btn-pause').addClass('d-none');
                clearInterval(el.setIntervalTime);
            }
        },
        setDefaultPieces: function () {
            //create pieces
            var el = this;
            var rows = [];
            for (let row = 0; row < el.rateHeightImage; row++) {
                var cols = [];
                for (let col = 0; col < el.rateWidthImage; col++) {
                    cols.push(null);
                }
                rows.push(cols);
            }
            el.defaultPieces = rows;
        },
        setPieces: function () {
            var el = this;
            var rows = [];
            for (let row = 0; row < parseInt(el.rateHeightImage) + 1; row++) {
                var cols = [];
                for (let col = 0; col < el.rateWidthImage; col++) {
                    cols.push(null);
                }
                rows.push(cols);
            }
            el.pieces = rows;
        },
        maxRate: function (pieceSize) {
            var checkSize = 0;
            var setMax = 0;
            do {
                if (pieceSize % checkSize === 0) {
                    setMax = checkSize;
                }
                checkSize += 1;
            } while (checkSize <= this.maxLevel);
            return setMax;
        },
        redirectPageChooseImage: function () {
            $('#modal-confirm .modal-title').text('Thoát trò chơi');
            $('#modal-confirm .modal-body').text('Bạn có chắc muốn thoát trò chơi không?');
            $('#modal-confirm').modal('show');
            this.checkResetOrExit = 'choose-image';
        },
        exitGame: function () {
            $('#modal-confirm .modal-title').text('Thoát trò chơi');
            $('#modal-confirm .modal-body').text('Bạn có chắc muốn thoát trò chơi không?');
            $('#modal-confirm').modal('show');
            this.checkResetOrExit = 'exit';
        },
        hideModalNotification: function () {
            $('#modal-notification').modal('toggle');
        },
        hideModalConfirm: function () {
            $('#modal-confirm').modal('toggle');
        },
        checkHideModalOrRedirectPage: function () {
            if (this.checkResetOrExit === 'finish-image') {
                window.location.replace(this.appUrl);
            } else {
                $('#modal-confirm').modal('toggle');
            }
        },
        resetOrExitGame: function () {
            if (this.checkResetOrExit === 'reset') {
                window.location.replace(this.appUrl + '/puzzle');
            } else if (this.checkResetOrExit === 'exit') {
                window.location.replace(this.appUrl);
            } else {
                window.location.replace(this.appUrl + '/puzzle/choose-image');
            }
        },
        checkLevel: function () {
            var el = this;
            var level = null;
            if (el.rateWidthImage >= 5 && el.rateHeightImage >= 5) {
                if (el.level == 1) {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 30, random_move: 100}
                } else if (el.level == 2) {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 60, random_move: 1000}
                } else {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 120, random_move: 10000}
                }
            } else {
                if (el.level == 1) {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 15, random_move: 50}
                } else if (el.level == 2) {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 30, random_move: 150}
                } else {
                    level = {time: el.setTimeCalculation !== '' ? parseInt(el.setTimeCalculation) : 60, random_move: 1000}
                }
            }
            return level;
        },
        intervalTime: function () {
            var el = this;
            el.setIntervalTime = setInterval(() => {
                el.timeStart -= 1;
                // does the same job as parseInt truncates the float
                let minutes = (el.timeStart / 60) | 0;
                let seconds = (el.timeStart % 60) | 0;

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $('#time').val(minutes + ":" + seconds);
                if (el.timeStart === 0) {
                    clearInterval(el.setIntervalTime);
                    $('#modal-game .modal-title').text('Hết thời gian');
                    var str = `<div class="row p-2">
                            <button type="button" class="btn btn-success w-25 m-auto" id="play-again">Chơi lại</button>
                       </div>
                       <div class="row">
                            <button type="button" class="btn btn-danger w-25 m-auto" id="exit">Thoát</button>
                       </div>`;
                    $('#modal-game .modal-body').html(str);
                    $('#modal-game').modal('show');
                }
            }, 1000);
        },
        showModalPause: function () {
            clearInterval(this.setIntervalTime);
            $('#modal-game .modal-title').text('Tạm dừng');
            var str = `<div class="row p-2">
                            <button type="button" class="btn btn-success w-25 m-auto" id="continue">Tiếp tục</button>
                       </div>
                       <div class="row">
                            <button type="button" class="btn btn-danger w-25 m-auto" id="exit">Thoát</button>
                       </div>`;
            $('#modal-game .modal-body').html(str);
            $('#modal-game').modal('show');
        },
        hideModalGame: function () {
            if (this.timeStart > 0) {
                this.intervalTime();
            }
            $('#modal-game').modal('toggle');
        },
        resetWhenTimeOut: function () {
            window.location.replace(this.appUrl + '/puzzle');
        },
        exitGameTimeOutOrPause: function () {
            window.location.replace(this.appUrl);
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

