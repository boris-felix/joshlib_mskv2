(function(J,$) {
	
	J.UIElement = J.Class({
		
		
		
		__constructor:function(app,id,options) {
			this.app = app;
			this.id = id;
			this.options = options || {};
			this.htmlId = this.getHtmlId();
			this.children=[];
			
			if (options["parent"]) {
			    options["parent"].registerChild(this);
			}
		},
		
		setLoading:function() {
			this.elementId.innerHTML = "Loading...";
		},
		
		registerChild:function(elt) {
		    this.children.push(elt);
		},
		
		insert:function() {
			var parent;
			if (this.options["parent"]) {
				parent = $("#"+this.options["parent"].htmlId);
			} else {
				parent = this.app.baseHtml;
			}
			
			parent.append(this.getHtml());
			
			if (this.options["onAfterInsert"]) this.options["onAfterInsert"](this);
			
			// Insert children elements that have the autoInsert flag
			for (var i=0;i<this.children.length;i++) {
			    if (this.children[i].options["autoInsert"]) {
			        this.children[i].insert();
			    }
			}
			
		},
		
		getHtmlId:function() {
			return this.app.id+"_e_"+this.type+"_"+this.id;
		}
		
		
	});
	
	J.UI = {};
	
	
	
})(Joshlib,jQuery);
