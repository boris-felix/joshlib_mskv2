(function(J,$) {
	
	/**
     * @class
     */
	J.Control = J.Class({
		
		__constructor:function(app) {
			this.app = app;
		},
		
	});
	
	J.Control.create = function(app,type) {
	    return new J.Controls[type](app);
	}
	
	J.Controls = {};
	
	
	
})(Joshlib,jQuery);
