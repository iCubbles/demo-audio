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
        is: 'audio-equalizer',
        treble: 1.0,
        middle: 1.0,
        bass: 1.0,
        bassBorderPerc: 0.005,
        middleBorderPerc: 0.09,
        overlap: 0.01,

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
        },

       modelTrebleChanged: function(value) {
            if (value > 100)
                value = 100;
            else if (value < 0.001)
                value = 0.001;
            
            this.treble = value/100;
        },
        modelMiddleChanged: function(value) {
            if (value > 100)
                value = 100;
            else if (value < 0.001)
                value = 0.001;
            
            this.middle = value/100;
        },
        modelBassChanged: function(value) {
            if (value > 100)
                value = 100;
            else if (value < 0.001)
                value = 0.001;
            
            this.bass = value/100;
        },
        modelInputChanged: function(value) { 
            if (Object.keys(value).length===0)
                return;
            
            var magn = value[0];
            var phase = value[1];
            
            var length = Object.keys(magn).length/2;
            
            var low = Math.round(length*this.bassBorderPerc);
            var middle = Math.round(length*this.middleBorderPerc);
            
            var ov = Math.round(this.overlap*length);
            magn[0] *= (this.bass*this.middle*this.treble);
            for (var i=1; i<length; i++) {
                if (i<low) {
                    magn[i] *= this.bass;
                }
                else if (i<=low+ov) {
                    var diff = i-low;
                    magn[i] *= (this.bass*(ov-diff)/ov+this.middle*diff/ov);
                }
                else if (i<middle) {
                    magn[i] *= this.middle;
                }
                else if (i<=middle+ov) {
                    var diff = i-middle;
                    magn[i] *= (this.middle*(ov-diff)/ov+this.treble*diff/ov);
                }
                else {
                    magn[i] *= this.treble;
                }
                magn[length*2-i] = magn[i];
            }
            magn[length] *= this.treble;
            
            this.setOutput([magn, phase]);
        }
    });
}());