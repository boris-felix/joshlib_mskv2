(function(J,Ext,_) {


    /**
     * @class Abstract list UI Element class
     * @augments J.UIElement
     */
    J.UIElementSencha = J.Class(J.UIElementBase,
    /** @lends J.UI.UIElementSencha.prototype */
    {

        //TODO CLEAN
        baseDefaultOptions: {
            hideDelay: 0,
            autoInsert: true,
            showOnFocus: true,
            showOnPreFocus: true,
            hideOnBlur: true
        },

        init: function() {
            this.senchaElement=false;
        },


        /**
    	 * Puts the element in loading mode
    	 * @function
    	 */
        setLoading: function(isLoading) {
            this.senchaElement.setLoading(isLoading);
        },

        /**
    	 * Show the element right away
    	 * @function
    	 */
        show: function() {
            this.publish("beforeShow");
            this.senchaElement.show();
            this.publish("afterShow");
        },

        /**
    	 * Hide the element right away
    	 * @function
    	 */
        hide: function() {
            
            this.publish("beforeHide");
            this.senchaElement.hide();
            this.publish("afterHide");
        },
        
        /**
    	 * Show the element, possibly with a delay
    	 * @function
    	 */
        showDelayed: function() {
            return this.show();
        },

        /**
    	 * Hide the element, possibly with a delay
    	 * @function
    	 */
        hideDelayed: function() {
            return this.hide();
        },
        
        insert:function() {
            
        }
        
    });
    
    J.UIElement = J.UIElementSencha;

})(Joshlib, Ext, _);