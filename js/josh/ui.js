(function(J,$) {
	
	J.UIElement = J.Class({
		
		
		__contruct:function(app,id,options) {
			this.app = app;
			this.id = id;
			this.elementId = this.app.getElementId(this.type,id);
		},
		
		setLoading:function() {
			this.elementId.innerHTML = "Loading...";
		}
		
	});
	
	J.UI = {};
	
	
	
})(Joshlib,jQuery);
