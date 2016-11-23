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
        is: 'slider-number',

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
            // set value-attribute of element with id='slota' to the initial value of slot 'a'
        },

        /**
         * A handler to be called by a dom-element
         * @param event
         */
        inputSliderChanged: function(event) {
            // update the cubixx-model
            this.setValue(event.target.value);
        },

        /**
         * A handler to be called by a dom-element when slider input changes (e.q. on dragging)
         * @param event
         */
        inputSliderDrag: function(event) {
            // only update the cubixx-model when onDrag is enabled
            if (this.getOnDrag()) {
                this.setValue(event.target.value);
            }
        },

        /**
         *  Observe the Cubixx-Component-Model: If value for slot 'a' has changed ...
         */
        modelValueChanged: function(value) {
            // update the view
            this.$.slider.value = value;
        },

        modelMinChanged: function(value) {
            // update the view
            this.$.slider.min = value;
        },

        modelMaxChanged: function(value) {
            // update the view
            this.$.slider.max = value;
        },

        modelLabelChanged: function(value) {
            this.$.label.innerHTML = value;
        }
    });
}());
