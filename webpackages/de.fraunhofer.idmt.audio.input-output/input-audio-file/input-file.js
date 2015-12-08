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
        is: 'input-audio-file',
        blockSize: 2048,
        req: new XMLHttpRequest(),
        play: "play",
        stop: "stop", 
        pause: "pause",
        paused: false,
        loading: false,

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
            // set value-attribute of element with id='slota' to the initial value of slot 'a'
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                alert("Audio is not supported in your browser");
            }
            
            this.myPCMProcessingNode = this.audioCtx.createScriptProcessor(this.blockSize, 1, 1);
            this.myPCMProcessingNode.onaudioprocess = this.processMethod.bind(this);
            this.myPCMProcessingNode.connect(this.audioCtx.destination);
            this.setAllStates([this.play, this.pause, this.stop]);
            this.changeToStopState();
        },

        processMethod: function(e) {
            this.setSamples(e.inputBuffer.getChannelData(0));
        },
        
        modelSourceChanged : function (value) {
            this.changeToStopState();
            this.req = new XMLHttpRequest(); 
            this.req.open("GET",value,true); 
            this.req.responseType = "arraybuffer"; 
            this.req.onload = this.audioLoaded.bind(this);
            this.req.send(); 
            this.loading = true;
        },
        
        audioLoaded: function() {
            //decode the loaded data 
            this.audioCtx.decodeAudioData(this.req.response, this.audioDecoded.bind(this), this.errorCallback.bind(this)); 
        },
        
        audioDecoded: function(buffer) {
            //save samples
            this.loading = false;
            this.buffer = buffer;
        },
        
        errorCallback: function(e) {
            console.log("Error in occured in audio file source: " + e);
        },
        
        modelStateChanged : function () {            
            var newState = this.getState().toString().toLowerCase();
            if (newState === this.play)
                this.changeToPlayState();
            else if (newState === this.pause)
                this.changeToPauseState();
            else if (newState === this.stop)
                this.changeToStopState();
            else
                console.log("Wrong state argument! Must be "+this.play+", "+this.pause+" or "+this.stop);
        },
        
        changeToPlayState: function() {
            if (this.state === this.play || this.loading)
                return;
            
            if (typeof(this.src) === undefined) {
                console.log("nothing loaded. play ignored");
                return;
            }
            
            //audio buffer source can be used only once so create new one each time with same buffer
            this.src = this.audioCtx.createBufferSource();  
            this.src.buffer = this.buffer; 
            this.src.connect(this.myPCMProcessingNode); 
            
            if (this.paused) {
                this.startedAt = Date.now() - this.pausedAt;
                this.src.start(0, this.pausedAt / 1000);
            }
            else {
                this.startedAt = Date.now();
                this.src.start(0);
            }
            
            this.state = this.play;
        },
        
        changeToPauseState: function() {
            if (this.state !== this.play)
                return;
            
            this.pausedAt = Date.now() - this.startedAt;
            this.paused = true;
    
            this.src.disconnect(this.myPCMProcessingNode); 
            this.src.stop(); 
            
            this.state = this.pause;
        },
        
        changeToStopState: function() {
            if (this.state === this.stop)
                return;
            
            if (this.state === this.play) {    
                this.src.disconnect(this.myPCMProcessingNode); 
                this.src.stop(); 
            }
            
            this.paused = false;
            this.state = this.stop;
        }
    });
}());