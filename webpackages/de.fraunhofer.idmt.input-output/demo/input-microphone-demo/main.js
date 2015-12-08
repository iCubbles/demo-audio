/*
    Add listener for MODEL_CHANGE -Events
 */

var micElement = document.getElementsByTagName('input-microphone')[0];

var _eventType = window.cubx.EventFactory.types.CIF_MODEL_CHANGE;
micElement.addEventListener(_eventType, modelChangeEventListener);
 
/**
 *
 * @param event
 */
function modelChangeEventListener(event) {
    var el = event.currentTarget;
    var samples = el.getSamples();
    var sum = 0;
    for (var i=0; i<samples.length; i++)
        sum += Math.abs(samples[i]);
    sum /= samples.length;   
    
    var label = document.getElementById('testLabel');
    label.innerHTML = "Volume: "+sum;
}


