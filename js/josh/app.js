(function(J,$) {
	
	J.App = J.Class({
		
		__construct:function() {
			this.menu = new J.Menu();
		},
		
		
		setBaseElementId:function(eltId) {
			this.baseElement = $("#"+eltId)[0];
		}
		
	});
	
	
	
	
})(Joshlib,jQuery);
