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
        this.$element.on('click', '.choose-image', function () {
            appChooseImage.chooseImage($(this));
        });
    }

    AppChooseImage.prototype = {
        _init: function _init() {
            this.ajaxSetup();
            this.initDropzone();
        },
        ajaxSetup: function ajaxSetup() {
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": _token
                }
            });
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
                    $('#upload-image-dropzone').removeClass('dz-started');
                    file.previewElement.remove();
                },
                error: function error(file) {
                    $('#upload-image-dropzone').removeClass('dz-started');
                    file.previewElement.remove();
                },
                success: function success(file, response) {
                    console.log(response);
                    $('#upload-image-dropzone').removeClass('dz-started');
                }
            });
        },
        chooseImage: function (t) {
            // console.log(t.data('path'));
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
