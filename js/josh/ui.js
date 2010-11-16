(function(J,$) {
	
	J.UIElement = J.Class({
		
		__construct:function(app,id,options) {
			this.app = app;
			this.id = id;
			this.options = options;
			this.htmlId = this.getHtmlId();
		},
		
		setLoading:function() {
			this.elementId.innerHTML = "Loading...";
		},
		
		insert:function() {
			var parent;
			if (this.options["parent"]) {
				parent = $("#"+this.options["parent"].htmlId)[0]
			} else {
				parent = this.app.baseElement;
			}
			parent.append(this.getHtml());
		},
		
		getHtmlId:function() {
			return this.app.id+"_e_"+this.type+"_"+this.id;
		}
		
		
	});
	
	J.UI = {};
	
	
	
})(Joshlib,jQuery);
