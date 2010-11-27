(function(J,$) {
	
	/**
     * @class
     */
	J.Control = J.Class({
		
		__construct:function() {
			
		},
		
	});
	
	J.Control.create = function(type) {
	    return new J.Controls[type];
	}
	
	J.Controls = {};
	
	
	
})(Joshlib,jQuery);
