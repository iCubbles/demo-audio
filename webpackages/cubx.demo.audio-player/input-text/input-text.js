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
        is: 'input-text',

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
        },

        inputvalueChangeHandler: function(event) {
            var myStr = event.target.value.toString();
            this.setValue(myStr);
        },
        
        modelValueChanged : function () {     
            this.$.inputField.value = this.getValue();
        },
        
        modelLabelChanged: function() {
            this.$.label.innerHTML = this.getLabel();
        }
    });
}());