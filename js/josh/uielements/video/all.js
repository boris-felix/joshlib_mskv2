(function(J,$) {
	
	/**
     * @class Abstract video UI Element class
     * @augments J.UIElement
     */
	J.UI.VideoBase = J.Class(J.UIElement,
	    /** @lends J.UI.VideoBase.prototype */
	    {
		type:"Video",
		
		init:function() {
        },

    	/**
    	 * Play a video
         * @function
         * @param {Object} options Options hash
         */        
		play:function(options) {
		    
		},
		
		/**
    	 * Pause the video
         * @function
         */
		pause:function() {
		    return;
	    },
	    
	    getHtml:function() {
			return "";
		}
	});
	
	
})(Joshlib,jQuery);
