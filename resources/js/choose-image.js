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
        this.$element.on('click', '#modal-confirm .cancel', function () {
            appChooseImage.hideModalConfirm();
        });
        this.$element.on('click', '#modal-confirm .btn-modal-save', function () {
            appChooseImage.startPuzzle();
        });
        //
        // $('#myModal').on('hidden.bs.modal', function (e) {
        //     // Xử lý khi modal đã đóng
        //     console.log('Modal đã đóng');
        // });
        this.$element.on('hidden.bs.modal', '#modal-confirm', function () {
            appChooseImage.reset();
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
                acceptedFiles: ".jpeg,.jpg,.png",
                headers: {
                    'X-CSRF-TOKEN': el.token
                },
                parallelUploads: 1,
                uploadMultiple: false,
                dictFileTooBig: 'Dung lượng file quá ' + el.fileSize + 'MB.',
                dictDefaultMessage: `<button type="button" class="icon upload margin-auto">
                        <span><i class="fa-solid fa-upload"></i></span>
                    </button>`,
                timeout: 20000,
                sending: function sending(file, xhr, formData) {
                    file.previewElement.remove();
                },
                error: function error(file, error) {
                    toastr.error(error.error);
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
            el.optionSizeImage(width, height);
            $('#choose-image').attr('src', el.appUrl + '/puzzle/show-image/' + pathImg);
            $('#modal-confirm').modal('show');
        },
        hideModalConfirm: function () {
            $('#modal-confirm').modal('toggle');
        },
        optionSizeImage: function (width, height) {
            var el = this;
            $('#rate-image').html('');
            var options = '';
            var level = 3;
            do {
                if (width % level === 0 && height % level === 0) {
                    options += `<div class="form-check">
                                <input class="form-check-input" type="radio" name="rate-image" id="${'rate-' + level}"
                                       value="${level}">
                                <label class="form-check-label" for="${'rate-' + level}">
                                    ${level}
                                </label>
                            </div>`;
                }
                level += 1;
            } while (level <= el.maxLevel);
            $('#rate-image').append(options);
        },
        startPuzzle: function () {
            var el = this;
            var rateImage = $('input[name=rate-image]:checked').val();

            if (rateImage !== undefined) {
                var pieceSize = el.widthImage / rateImage;
                var chooseImage = {
                    'path_image' : el.pathImage,
                    'width_image' : el.widthImage,
                    'height_image' : el.heightImage + pieceSize,
                    'rate_image' : rateImage,
                    'piece_image' : pieceSize,
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
