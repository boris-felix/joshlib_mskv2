(function(J,$) {
	
	J.UIElement = J.Class({
		
		defaultOptions:{},
		
		__constructor:function(app,id,options) {

			this.app = app;
			this.id = id;
			this.options = $.extend({},options || {},this.defaultOptions);
			this.htmlId = this.getHtmlId();
			this.children=[];
			this._subscribed = [];
			
			this.hasFocus = false;
			
			if (options["parent"]) {
			    options["parent"].registerChild(this);
			}
			
			//Listen for any new menuData
			
			var self = this;
			
			if (this.options["menuRoot"]) {

			    J.subscribe("menuData",function(ev,data) {
			        //This menuData is about us!
    			    if (self.options["menuRoot"]==data[0] || (self.options["menuRoot"]+"/")==data[0] || (typeof self.options["menuRoot"]!="string" && self.options["menuRoot"].test(data[0]))) {
    			        self.setData(data[0],data[1]);
    			        
    			        self.refresh();
    			    }
    			});
    			
    			J.subscribe("menuChange",function(ev,data) {
                    
			        //This menuData is about us!
    			    if (self.options["menuRoot"]==data[1] || (self.options["menuRoot"]+"/")==data[1] || (typeof self.options["menuRoot"]!="string" && self.options["menuRoot"].test(data[1]))) {
    			        
    			        if (data[0]=="focus") {
    			            self.onFocus();
    			            
    			        } else if (data[0]=="current") {
    			            //
    			        }
    			    }
    			});
			}
			
			
			
			this.init();
		},
		
		init:function() {
		    
		},
		
		setLoading:function() {
			this.elementId.innerHTML = "Loading...";
		},
		
		registerChild:function(elt) {
		    this.children.push(elt);
		},
		
		subscribes:function() {
		    return [];
		},
		
		onFocus:function() {
		    
		    this.hasFocus = true;
		    
		    var self=this;
		    this.subscribes().forEach(function(s) {
				self._subscribed.push(J.subscribe(s[0],s[1]));
		    });
		},
		onBlur:function() {
		    this.hasFocus = false;
		    this._subscribed.forEach(function(s) {
		        J.unsubscribe(s);
		    });
		},
		
		refresh:function() {
		    
		    //This is a bit rough but works for now
		    $("#"+this.htmlId).remove();
		    this.insert();
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
