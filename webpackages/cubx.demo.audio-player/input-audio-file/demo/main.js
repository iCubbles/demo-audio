/*
    Add listener for MODEL_CHANGE -Events
 */
var loader = document.getElementsByTagName('input-audio-file')[0];
var _eventType = window.cubx.EventFactory.types.CIF_MODEL_CHANGE;
loader.addEventListener(_eventType, modelChangeEventListener);
var inputEl = document.getElementById('testInput');

var sampleBuffer = []; 
var blockSize = 2048;

try {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    alert("Audio is not supported in your browser");
}

var myPCMProcessingNode = audioCtx.createScriptProcessor(this.blockSize, 0, 1);
myPCMProcessingNode.onaudioprocess = processMethod;
myPCMProcessingNode.connect(audioCtx.destination);

window.addEventListener('cifReady', function() {
    sourceChanged();
});

function playClicked() {
    loader.setState("play");
}

function pauseClicked() {
    loader.setState("pause");
}

function stopClicked() {
    loader.setState("stop");
}

function sourceChanged() {
    console.log("source "+inputEl.value.toString());
    loader.setSource(inputEl.value.toString());
}
/**
 * @brief writes samples from component to buffer for output.
 */
function modelChangeEventListener() {
    var samples = loader.getSamples(); 
    if (samples === undefined)
        return;
    
    for (var i=0; i<samples.length; i++) {
        sampleBuffer.push(samples[i]);
    }
}

/**
 * @brief test audio output method, puts sample buffer to output device.
 */
function processMethod(e) {
    var size = e.outputBuffer.getChannelData(0).length;
    var buffer = e.outputBuffer.getChannelData(0);

    if (sampleBuffer.length < size)
        return;

    for (var i=0; i<size; i++) {
        buffer[i] = sampleBuffer.shift();
    }
}


