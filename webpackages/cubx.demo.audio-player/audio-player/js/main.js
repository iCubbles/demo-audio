'use strict';
(function() {
    document.addEventListener('cifReady', function() {
        console.log("ready");

        $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1">');

        $('div[cubx-core-crc]').addClass('container');

        var inputTextFile = $('[member-id="inputText"]');
        inputTextFile.addClass('col-md-6');
        inputTextFile.find('input').addClass('form-control');
        $('[member-id="selectFile"]').addClass('col-md-6');
        $('[member-id="selectFile"]').find('input').addClass('form-control');
    });
})();
