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
			
			this.menuRoot = false;
			
			if (options["parent"]) {
			    options["parent"].registerChild(this);
			}
			
			//Listen for any new menuData
			
			var self = this;
			
			if (this.options["menuRoot"]) {
			    
			    this.app.subscribe("menuDataLoading",function(ev,data) {

			        //This menuData is about us!
    			    if (self.menuRoot==data[0]) {
    			        self.setLoading();
    			        self.refresh();
    			    }
    			});
                
			    this.app.subscribe("menuData",function(ev,data) {
			        
			        //This menuData is about us!
    			    if (self.menuRoot==data[0]) {
    			        self.setData(data[1]);
    			        self.refresh();
    			    }
    			});
    			
    			this.app.subscribe("menuChange",function(ev,data) {

			        //This menuData is about us!
    			    if (self.options["menuRoot"]==data[1] || (typeof self.options["menuRoot"]!="string" && self.options["menuRoot"].test(data[1]))) {

    			        if (data[0]=="focus") {
    			            self.setMenuRoot(data[1]);
    			            
    			            var mdata = self.app.menu.getData(self.menuRoot);
//    			            console.log("m",mdata,self.menuRoot);
    			            if (mdata) {
    			                self.setData(mdata);
    			                self.refresh();
    			            }
    			            
    			            self.onFocus(data[1]);
    			          
    			        //When we're expected to be the next focus
    			        } else if (data[0]=="prefocus") {
        			        self.menuRoot = data[1];
    			            
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
		
		setMenuRoot:function(menuRoot) {
		    this.menuRoot = menuRoot;
		},
		
		setLoading:function() {

			$("#"+this.htmlId).html("Loading...");
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
    				self._subscribed.push(self.app.subscribe(s[0],s[1]));
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
		    var self=this;
		    this._subscribed.forEach(function(s) {
		        self.app.unsubscribe(s);
		    });
		},
		
		refresh:function(callback)
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
				// $("#"+this.htmlId).remove();
				// this.insert();
				
				if ($("#"+this.htmlId).length==0)
				{
					if (this.options["autoInsert"]===true)
					{
						// ok coco, en fait, ton élément a disparu ou n'existe pas encore.  Tu viens de rafraichir tes données. Mais comme on souhaite arbitrairement t'insérer, on va pas t'afficher en mode automatique si tu n'es pas encore présent.
						this.insert();
					}
				} else {
					$("#"+this.htmlId).html(this.getHtmlInner());
				}
			}
			
			// c'est pas que ça fait doublon, c'est surtout que ça permet de faire un post-traitement...
			if (typeof this.options["onAfterRefresh"]==='function') { continuous = this.options["onAfterRefresh"](this); }
			if (typeof callback==='function') { callback(); }
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
//			console.log(this.id,this.getHtml());
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
		},
		
		setData:function(data) {
			this.data = data;
		}
		
	});
	
	J.UI = {};
	
	
	
})(Joshlib,jQuery);
