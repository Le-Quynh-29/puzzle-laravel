$(function () {
    var url = _url;
    $('.glowing-btn').on('click', function () {
        window.location.replace(url + '/puzzle/choose-image');
    });
});

(function ($) {
    "use strict";
    var AppStartGame = function AppStartGame(element, options, cb) {
        var appStartGame = this;
        this.element = element;
        this.$element = $(element);
        this.appUrl = _url;
        this.$element.on('click', '.btn-start-game', function () {
            appStartGame.redirectPageChooseImage();
        });
    };

    AppStartGame.prototype = {
        _init: function _init() {
            this.init();
        },
        init: function () {
            localStorage.removeItem('choose_image');
        },
        redirectPageChooseImage: function () {
            var el = this;
            window.location.replace(el.appUrl + '/puzzle/choose-image');
        }
    };

    $.fn.appStartGame = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (!el.data("appStartGame")) {
                var appStartGame = new AppStartGame(el, options, cb);
                el.data("appStartGame", AppStartGame);
                appStartGame._init();
            }
        });
        return this;
    };

})(jQuery);

$(document).ready(function () {
    $("body").appStartGame();
});
