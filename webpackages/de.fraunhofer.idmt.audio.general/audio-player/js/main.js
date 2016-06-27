'use strict';
var firstTime = true;
(function() {
    document.addEventListener('cifReady', function() {
        //TODO
        //use bool check 
        // -> otherwise cif ready received each time .wrap is called 
        // -> endless loop
        if (!firstTime)
            return;
        
        firstTime = false;
        console.log("ready");

        $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1">');
        
        $('div[cubx-core-crc]').addClass('container'); 
        
        $('audio-player').wrap( "<div id='audioPlayerFrame'></div>" );

        //file inputs
        $('audio-player').children('[member-id="inputText"], [member-id="selectFile"]').wrapAll( "<div class='row vertical-align'></div>" );
        var inputTextFile = $('[member-id="inputText"]');
        inputTextFile.addClass('col-md-6');
        inputTextFile.find('article').children().wrapAll( "<div class='row vertical-align'></div>" );
        inputTextFile.find('label').wrap( "<div class='col-md-1'></div>" );
        inputTextFile.find('label').addClass('label');
        inputTextFile.find('input').wrap( "<div class='col-md-11'></div>" );
        inputTextFile.find('input').addClass('form-control');
        $('[member-id="selectFile"]').addClass('col-md-6');
        $('[member-id="selectFile"]').find('input').addClass('form-control');
        
        //button bar
        $('button-bar').wrap("<div class='row vertical-align'></div>" );
        $('button-bar').addClass('col-md-4');
        $('button-bar').children('button').wrapAll( "<div class='row vertical-align'></div>" );
        $('button-bar').find('button').addClass('btn col-md-4');
        
        //we could also search for all sliders but this way is more stable and could be used in bde
        $('[member-id="volumeSlider"]').addClass('col-md-3');
        $('[member-id="bassSlider"]').addClass('col-md-3');
        $('[member-id="middleSlider"]').addClass('col-md-3');
        $('[member-id="trebleSlider"]').addClass('col-md-3');
        
        $('[member-id="volumeSlider"]').find('article').children().wrapAll( "<div class='row vertical-align'></div>" );
        $('[member-id="bassSlider"]').find('article').children().wrapAll( "<div class='row vertical-align'></div>" );
        $('[member-id="middleSlider"]').find('article').children().wrapAll( "<div class='row vertical-align'></div>" );
        $('[member-id="trebleSlider"]').find('article').children().wrapAll( "<div class='row vertical-align'></div>" );
        
        $('slider-number *').find('label').addClass('col-md-1');
        $('slider-number *').find('input').addClass('col-md-11');
    });
})();
