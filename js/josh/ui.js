(function(J,$) {
	
	/**
     * @class
     */
	J.UIElement = J.Class(
	    
	    /**
            @lends J.UIElement.prototype
        */
	    {
		
		defaultOptions:{},
		
		
		__constructor:function(app,id,options) {

			this.app = app;
			this.id = id;
			this.options = $.extend({},this.defaultOptions,options || {});
			this.htmlId = this.getHtmlId();
			this.children=[];
			this._subscribed = [];
			this.hasFocus = false;
			this.inserted = false;
			
			if (options["parent"]) {
			    options["parent"].registerChild(this);
			}
			
			//Listen for any new menuData
			
			var self = this;
			
			if (this.options["menuRoot"]) {

			    J.subscribe("menuData",function(ev,data) {
			        //This menuData is about us!
    			    if (self.options["menuRoot"]==data[0] || (typeof self.options["menuRoot"]!="string" && self.options["menuRoot"].test(data[0]))) {
    			        self.setData(data[0],data[1]);
    			        
    			        self.refresh();
    			    }
    			});
    			
    			J.subscribe("menuChange",function(ev,data) {

			        //This menuData is about us!
    			    if (self.options["menuRoot"]==data[1] || (typeof self.options["menuRoot"]!="string" && self.options["menuRoot"].test(data[1]))) {

    			        if (data[0]=="focus") {
    			            self.onFocus(data[1]);
    			            
    			        } else if (data[0]=="current") {
    			            //
    			        }
    			        
    			    //Was a focus on another element: blur us
    			    } else if (data[0]=="focus" && self.hasFocus) {
    			        self.onBlur(data[1]);
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
		
		onFocus:function(path) {
		    
		    if (!this.hasFocus)
			{   
    		    var self=this;
    		    this.subscribes().forEach(function(s) {
    				self._subscribed.push(J.subscribe(s[0],s[1]));
    		    });
		    
    		    if (this.options["showOnFocus"]===true)
				{
    		        this.show();
    		    }
    		    if (typeof this.options["showOnFocus"]==='function')
				{
    		        this.options["showOnFocus"]();
    		    }
    	    }
		    this.hasFocus = true;
		    
		},
		
		onBlur:function(path) {
		    if (this.options["hideOnBlur"]===true) {
		        this.hide();
		    }
		    
		    if (typeof this.options["hideOnBlur"]==='function')
			{
		        this.options["hideOnBlur"]();
		    }
		    
		    this.hasFocus = false;
		    this._subscribed.forEach(function(s) {
		        J.unsubscribe(s);
		    });
		},
		
		refresh:function()
		{
			var continuous = true;
			if (typeof this.options["refresh"]==='function')
			{
				// il se trouve que dans certains cas, on préfère manuellement rafraichir les données, notamment pour éviter le flicking désagréable pour le renouvellement chez France 24
				continuous = this.options["refresh"](this);
			} 
			
			if (continuous)
			{
				//This is a bit rough but works for now
				$("#"+this.htmlId).remove();
				this.insert();
			}
		},
		
		show:function() {		    
			var continuous = true;
			if (typeof this.options["show"]==='function')
			{
				continuous = this.options["show"](this);
			} 
			if (continuous)
			{
				$("#"+this.htmlId).show();
			}
		},
		
		hide:function() {
			var continuous = true;
			if (typeof this.options["hide"]==='function')
			{
				continuous = this.options["hide"](this);
			} 
			if (continuous)
			{
				$("#"+this.htmlId).hide();
			}
		},
		
		insert:function() {
			var parent;
			if (this.options["parent"]) {
				parent = $("#"+this.options["parent"].htmlId);
			} else {
				parent = this.app.baseHtml;
			}
			
			parent.append(this.getHtml());
			this.inserted=true;
			
			if (this.options["autoShow"]) {
			    this.show();
			}
			
			if (this.options["onAfterInsert"]) {
			    this.options["onAfterInsert"](this);
			}
			
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
