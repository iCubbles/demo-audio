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
        is: 'button-bar',
        buttons: [],

        /**
         * Manipulate an element’s local DOM when the element is constructed.
         */
        ready: function() {
            // set value-attribute of element with id='slota' to the initial value of slot 'a'
        },
        
        modelButtonsChanged : function () {     
            for (var i=0; i<this.buttons.length; i++)  {
                Polymer.dom(this.root).removeChild(this.buttons[i]);
            }
            this.buttons = [];
            
            var buttonNames = this.getButtons();
            for (var i=0; i<buttonNames.length; i++) {
                this.addButton(buttonNames[i]);
            }
        },
        
        addButton : function(name) {
            //Create an input type dynamically.
            var element = document.createElement("button");

            //Assign different attributes to the element.
            element.setAttribute("type", "button");
            element.innerHTML = name;
            element.setAttribute("value", name);
            element.addEventListener('click',this.buttonPressed.bind(this));

            Polymer.dom(this.root).appendChild(element);
            this.buttons.push(element);
        },
        
        buttonPressed : function(e) {
            this.setPressed(e.currentTarget.value);
        }
    });
}());