(function(J,$) {

	J.Input = J.Class(
	    /** @lends J.Input.prototype */
	    {
		
		/**
         * @class Abstract class for inputs
         * @constructs
         * @param {J.App} app Reference to the app
         */
		__constructor:function(app) {
			this.app = app;
		},
		
	});
	
	/**
	 * Singleton for instanciating an input
	 * @function
	 * @param {J.App} Reference to the app
	 * @param {String} inputName Name of the input
	 * @returns {J.Input} Input object
	 */
	J.Input.create = function(app,inputName) {
	    return new J.Inputs[inputName](app);
	}
	
	/** 
	    @namespace A namespace for Inputs 
	*/
	J.Inputs = {};
	
	
	
})(Joshlib,jQuery);
