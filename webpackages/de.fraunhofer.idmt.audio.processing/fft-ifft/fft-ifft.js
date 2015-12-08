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
        is: 'fft-ifft',
        fftProcessing: null,
        sampleRate: 44100,
        blockSize: 0,
        hopSize: 0,
        window: new WindowFunction(DSP.HANN),
        inputBufferWindow: null,
        buffer: null,
        inverseBuffer: null,
        returnBuffer: null,
        returnBlockCounter: 0,
        realInverseWindow: null,
        realImagWindow: null,

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
        },
        
        modelSampleRateChanged: function(value) {
            this.sampleRate = value;
            this.blockSize = 0; // so fft is reinit
        },
        
        init: function(size) {
            this.blockSize = size;
            this.hopSize = size/2;
            this.returnBuffer  = new Float32Array(this.blockSize); 
            this.buffer  = new Float32Array(this.blockSize); 
            this.fftProcessing = new FFT(this.blockSize, this.sampleRate);
            this.inputBufferWindow = new Float32Array(this.blockSize+this.hopSize);
            this.inverseBuffer = new Float32Array(this.hopSize);
            this.realInverseWindow = new Float32Array(this.blockSize);
            this.realImagWindow = new Float32Array(this.blockSize);
        },
        
         modelForwardChanged: function(value) { 
            //change string to float32Array
            if (Object.keys(value).length !== this.blockSize) {
                this.init(Object.keys(value).length);
            }
            
            var index = 0;
            for (var el in value) {
                this.buffer[index] = value[el];
                index++;
            }
            
            this.fftProcessing.forward(this.buffer);
            var real = this.fftProcessing.real;
            var imag = this.fftProcessing.imag;            
            
            var magn = new Float32Array(real.length);
            var phase = new Float32Array(real.length);
            
            for (var i=0; i<real.length; i++) {
                magn[i] = Math.sqrt(real[i]*real[i]+imag[i]*imag[i]);
                phase[i] = Math.atan2(imag[i], real[i]);
            }
            
            this.setResultFromForward([magn, phase]);
        },
        
        modelInverseChanged: function(value) {       
            var magn = value[0];
            var phase = value[1];
            
            var real = new Float32Array(Object.keys(magn).length);
            var imag = new Float32Array(real.length);
            
            for (var i=0; i<real.length; i++) {
                real[i] = magn[i]*Math.cos(phase[i]);
                imag[i] = magn[i]*Math.sin(phase[i]);
            }
            
            var buffer = this.fftProcessing.inverse(real, imag);
            this.setResultFromInverse(buffer);
        },
        
        modelForwardWindowedChanged: function(value) { 
            //change string to float32Array            
            if (Object.keys(value).length !== this.blockSize) {
                this.init(Object.keys(value).length);
            }
            else
            {
                //copy old data to front
                for (var i=0; i<this.hopSize; i++)
                    this.inputBufferWindow[i] = this.inputBufferWindow[i+this.blockSize];
            }
            
            //copy new data at end
            var index = this.hopSize;
            for (var el in value) {
                this.inputBufferWindow[index] = value[el];
                index++;
            }
            
            for (var block=0; block<2; block++)
            {
                for (var i=0; i<this.blockSize; i++) {
                    this.buffer[i] = this.inputBufferWindow[i+this.hopSize*block];
                }
                    
                this.fftProcessing.forward(this.window.process(this.buffer));
                var real = this.fftProcessing.real;
                var imag = this.fftProcessing.imag;     

                var magn = new Float32Array(real.length);
                var phase = new Float32Array(real.length);

                for (var i=0; i<real.length; i++) {
                    magn[i] = (Math.sqrt(real[i]*real[i]+imag[i]*imag[i]));
                    phase[i] = Math.atan2(imag[i], real[i]);
                }

                this.setResultFromForwardWindowed([magn, phase]);
            }
        },
        
        modelInverseWindowedChanged: function(value) {       
            var magn = value[0];
            var phase = value[1];
            
            for (var i=0; i<this.blockSize; i++) {
                this.realInverseWindow[i] = magn[i]*Math.cos(phase[i]);
                this.realImagWindow[i] = magn[i]*Math.sin(phase[i]);
            }
            
            var buffer = this.fftProcessing.inverse(this.realInverseWindow, this.realImagWindow);
            
            //overlap add
            var startIndex = this.returnBlockCounter*this.hopSize;
            for (var i=0; i<this.hopSize; i++) {
                this.returnBuffer[i+startIndex] = buffer[i]+this.inverseBuffer[i];
            }
            
            //remember unused part
            for (var i=0; i<this.hopSize; i++) {
                this.inverseBuffer[i] = buffer[i+this.hopSize];
            }
            
            this.returnBlockCounter++;
            
            if (this.returnBlockCounter === 2) {
                this.returnBlockCounter = 0;
                this.setResultFromInverseWindowed(this.returnBuffer);
            }
        }
    });
}());