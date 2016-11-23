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
        is: 'select-file',

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
            // set value-attribute of element with id='slota' to the initial value of slot 'a'
        },

       handleFileSelect: function(evt) {            
            var reader = new FileReader();
            var cbxPtr = this;

            // get url
            reader.onload = function(event) {
              var url = event.target.result;
              cbxPtr.setUrl(url);
            };

            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(evt.target.files[0]);
            this.setFilename(evt.target.files[0].name);
        }
    });
}());