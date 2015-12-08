/*
    Add listener for MODEL_CHANGE -Events
 */

var player = document.getElementsByTagName('output-speakers')[0];

var slider = document.getElementById("freqSlider");
slider.onchange = function() { 
    oscillator.frequency.value = slider.value;
};

var volSlider = document.getElementById("volumeSlider");
volSlider.onchange = function() {
    player.setVolume(volSlider.value);
};

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioCtx.createOscillator();

oscillator.type = 'sine';
oscillator.frequency.value = 200; // value in hertz

var ready = false;
window.addEventListener('cifReady', function() {
    ready = true;
});

myPCMProcessingNode = this.audioCtx.createScriptProcessor(1024, 1, 1);
myPCMProcessingNode.onaudioprocess = function(e) {
    if (!ready)
        return;
    
    player.setSamples(JSON.parse(JSON.stringify(e.inputBuffer.getChannelData(0))));
};

oscillator.connect(myPCMProcessingNode);
myPCMProcessingNode.connect(audioCtx.destination);
oscillator.start();


