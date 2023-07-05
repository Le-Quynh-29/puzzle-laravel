(function ($) {
    "use strict";
    var AppChooseImage = function AppChooseImage(element, options, cb) {
        var appChooseImage = this;
        this.element = element;
        this.$element = $(element);
        this.appUrl = _url;
        this.token = _token;
        this.fileSize = 10;
        this.urlUploadImage = _urlUploadImage;
        this.maxLevel = _maxLevel;
        this.pathImage = '';
        this.widthImage = 0;
        this.heightImage = 0;
        this.$element.on('click', '.choose-image', function () {
            appChooseImage.chooseImage($(this));
        });
        this.$element.on('click', '#modal-choose-image .cancel', function () {
            appChooseImage.hideModalConfirm();
        });
        this.$element.on('click', '#modal-choose-image .btn-modal-save', function () {
            appChooseImage.startPuzzle();
        });
        // this.$element.on('hidden.bs.modal', '#modal-choose-image', function () {
        //     appChooseImage.reset();
        // });
        this.$element.on('click', '#modal-notification .close-modal', function () {
            appChooseImage.hideModalNotification();
        });
        this.$element.on('change', '.check-time', function () {
            appChooseImage.checkShowTime();
        });
    }

    AppChooseImage.prototype = {
        _init: function _init() {
            this.ajaxSetup();
            this.init();
            this.initDropzone();
        },
        ajaxSetup: function ajaxSetup() {
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": _token
                }
            });
        },
        init: function () {
            localStorage.removeItem('choose_image');
        },
        initDropzone: function initDropzone() {
            var el = this;

            $("#upload-image-dropzone").dropzone({
                url: el.urlUploadImage,
                maxFiles: 1,
                maxFilesize: el.fileSize,
                acceptedFiles: 'image/*',
                headers: {
                    'X-CSRF-TOKEN': el.token
                },
                parallelUploads: 1,
                uploadMultiple: false,
                thumbnailWidth: 300,
                dictFileTooBig: 'Dung lượng file quá ' + el.fileSize + 'MB.',
                dictDefaultMessage: `<button type="button" class="icon upload margin-auto" style="width: 4rem; height: 4rem">
                        <span><i class="fa-solid fa-upload"></i></span>
                    </button>`,
                timeout: 20000,
                init: function () {
                    this.on("thumbnail", function(file) {
                        var checkRateWidthImage = el.optionSizeImage('width', file.width);
                        var checkRateHeightImage = el.optionSizeImage('height', file.height);
                        if (file.width < 250 || file.width > 1300 || file.height > 500) {
                            file.rejectDimensions();
                        } else if (!checkRateWidthImage || !checkRateHeightImage) {
                            file.checkRateImage();
                        } else if (checkRateWidthImage && checkRateHeightImage) {
                            file.acceptRateImage();
                        } else {
                            file.acceptDimensions();
                        }
                    });
                },
                sending: function sending(file, xhr, formData) {
                    file.previewElement.remove();
                },
                error: function error(file, error) {
                    el.errorUploadFile(error.error ? error.error : error);
                    file.previewElement.remove();
                    $('#upload-image-dropzone').removeClass('dz-started');
                    this.removeAllFiles();
                },
                success: function success(file, response) {
                    $('#upload-image-dropzone').removeClass('dz-started');
                    var data = response.data;
                    el.pathImage = data.path;
                    el.widthImage = data.width;
                    el.heightImage = data.height;
                    el.showChooseImage(el.pathImage, el.widthImage, el.heightImage);
                    var img = `<div class="col-6 p-2 choose-image" data-path="${el.pathImage}" data-width="${el.widthImage}"
                                data-height="${el.heightImage}">
                                    <img src="${el.appUrl + '/puzzle/show-image/' + el.pathImage}" class="w-100 fit-image" height="180">
                              </div>`;
                    $('#list-image').prepend(img);
                },
                accept: function(file, done) {
                    file.acceptDimensions = done;
                    file.acceptRateImage = done;
                    file.rejectDimensions = function() { done("Kích thước ảnh chiều ngang tối thiểu 250px và tối đa 1300px, chiều dọc tối đa 500px."); };
                    file.checkRateImage = function() { done("Ảnh "+ file.name +" không thể chia tỉ lệ."); };
                }
            });
        },
        chooseImage: function (t) {
            var el = this;
            el.pathImage = t.data('path');
            el.widthImage = t.data('width');
            el.heightImage = t.data('height');
            el.showChooseImage(el.pathImage, el.widthImage, el.heightImage);
        },
        showChooseImage: function (pathImg, width, height) {
            var el = this;
            el.optionSizeImage('width', width);
            el.optionSizeImage('height', height);
            $('#yes').prop('checked', true);
            $('#level-1').prop('checked', true);
            $('#choose-image').attr('src', el.appUrl + '/puzzle/show-image/' + pathImg);
            $('#modal-choose-image').modal('show');
        },
        hideModalConfirm: function () {
            $('#modal-choose-image').modal('toggle');
        },
        optionSizeImage: function (idSize, size) {
            var el = this;
            $('#' + idSize).html('');
            var options = '';
            var level = 3;
            var checkRateImage = false;
            do {
                if (size % level === 0) {
                    checkRateImage = true;
                    options += `<div class="form-check">
                                <input class="form-check-input" type="radio" name="${idSize}-image" id="${idSize + "-" + level}"
                                       value="${level}">
                                <label class="form-check-label" for="${idSize + "-" + level}">
                                    ${level}
                                </label>
                            </div>`;
                }
                level += 1;
            } while (level <= el.maxLevel);
            $('#' + idSize).append(options);
            return checkRateImage;
        },
        startPuzzle: function () {
            var el = this;
            var rateWidthImage = $('input[name=width-image]:checked').val();
            var rateHeightImage = $('input[name=height-image]:checked').val();
            var level = $('input[name=level-image]:checked').val();
            var checkTime = $('input[name=check-time]:checked').val();
            if (rateWidthImage !== undefined && rateHeightImage !== undefined) {
                var pieceWidthSize = el.widthImage / rateWidthImage;
                var pieceHeightSize = el.heightImage / rateHeightImage;
                var chooseImage = {
                    'path_image' : el.pathImage,
                    'width_image' : el.widthImage,
                    'height_image' : el.heightImage + pieceHeightSize,
                    'rate_width_image' : rateWidthImage,
                    'rate_height_image' : rateHeightImage,
                    'piece_width_image' : pieceWidthSize,
                    'piece_height_image' : pieceHeightSize,
                    'level' : level,
                    'check_time_calculation' : checkTime,
                    'time_calculation' : $('#set-time').val(),
                }
                localStorage.setItem('choose_image', JSON.stringify(chooseImage));
                window.location.replace(el.appUrl + '/puzzle');
            } else {
                toastr.info("Chọn cấp độ để bắt đầu chơi!");
            }
        },
        reset: function () {
            this.pathImage = '';
            this.widthImage = 0;
            this.heightImage = 0;
            localStorage.removeItem('choose_image');
        },
        errorUploadFile: function (error) {
            $('#modal-notification .modal-title').text('Lỗi');
            $('#modal-notification .modal-body').text(error);
            $('#modal-notification').modal('show');
        },
        hideModalNotification: function () {
            $('#modal-notification').modal('toggle');
        },
        checkShowTime: function () {
            var checkTime = $('input[name=check-time]:checked').val();
            if (checkTime === "no") {
                $('#set-time').addClass('d-none');
            } else {
                $('#set-time').val('');
                $('#set-time').removeClass('d-none');
            }
        }
    };

    $.fn.appChooseImage = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (!el.data("appChooseImage")) {
                var appChooseImage = new AppChooseImage(el, options, cb);
                el.data("appChooseImage", AppChooseImage);
                appChooseImage._init();
            }
        });
        return this;
    };

})(jQuery);

Dropzone.autoDiscover = false;
$(document).ready(function () {
    $("body").appChooseImage();
});
