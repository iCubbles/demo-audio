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
        is: 'input-microphone',
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
            
            // Check if there is microphone input.
            try {
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
            } catch (e) {
                alert("Audio capture is not supported in your browser");
            }
            
            var errorCallback = function(e) {
                alert("Error in getUserMedia: " + e);
            };
            
            
            this.myPCMProcessingNode = this.audioCtx.createScriptProcessor(this.blockSize, 1, 1);
            this.myPCMProcessingNode.onaudioprocess = this.processMethod.bind(this);
            
            // Get access to the microphone and start pumping data through the  graph.
            navigator.getUserMedia({
                audio: true
            }, this.connectStream.bind(this), errorCallback);
            
            this.myPCMProcessingNode.connect(this.audioCtx.destination);
        },

        connectStream: function(stream) {
            window.microphone = this.audioCtx.createMediaStreamSource(stream);
            window.microphone.connect(this.myPCMProcessingNode);
        },
        
        processMethod: function(e) {
            this.setSamples(e.inputBuffer.getChannelData(0));
        }
    });
}());