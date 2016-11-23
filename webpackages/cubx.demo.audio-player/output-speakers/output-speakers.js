(function() {
    'use strict';
    /**
     * Get help:
     * > Lifecycle callbacks:
     * https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html#lifecycle-callbacks
     *
     * Access the Cubixx-Component-Model:
     * > Access slot values:
     * slot 'a': this.getA(); | this.setA(value)
     */
    CubxPolymer({
        is: 'output-speakers',
        sampleBuffer:   [], 
        blockSize: 2048,

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                alert("Audio capture is not supported in your browser");
            }
            
            this.myPCMProcessingNode = this.audioCtx.createScriptProcessor(this.blockSize, 0, 1);
            this.myPCMProcessingNode.onaudioprocess = this.processMethod.bind(this);
            
            this.gainNode = this.audioCtx.createGain();
            this.myPCMProcessingNode.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
        },

        modelSamplesChanged : function (value) {
            for (var el in value) {
                this.sampleBuffer.push(value[el]);
            }
        },
        
        modelVolumeChanged : function (value) {
            if (value > 100)
                value = 100;
            else if (value < 0)
                value = 0;
            
            this.gainNode.gain.value = value/100;
        },
        
        processMethod: function(e) {
            var size = e.outputBuffer.getChannelData(0).length;
            var buffer = e.outputBuffer.getChannelData(0);
            
            //TODO how to handle?
            if (this.sampleBuffer.length < size)
                return;                
            
            for (var i=0; i<size; i++) {
                buffer[i] = this.sampleBuffer.shift();
            }
        }
    });
}());