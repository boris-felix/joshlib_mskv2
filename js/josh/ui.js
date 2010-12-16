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
			
			this.nextShowHide=false;
			
			var self=this;
			this.showHideSwitch = new J.DelayedSwitch(function() {
			    self.processShowHide();
			},null,1000);
			
			this.menuRoot = false;
			this.menuCurrent = false;
            
			
			if (options["parent"]) {
			    options["parent"].registerChild(this);
			}
			
			//Listen for any new menuData
			
			if (this.options["menuRoot"]) {
			    
			    this.app.subscribe("menuDataLoading",function(ev,data) {

                    console.log("LOADING",self.id,self.menuRoot,data[0])
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
    			            console.log("m focus",mdata,self.menuRoot);
    			            if (mdata) {
    			                if (mdata=="loading") {
    			                    self.setLoading();
    			                } else {
    			                    self.setData(mdata);
    			                }
    			                self.refresh();
    			            }
    			            
    			            self.onFocus(data[1]);
    			          
    			        //When we're expected to be the next focus
    			        } else if (data[0]=="prefocus") {
        			        self.setMenuRoot(data[1]);
        			        
        			        var mdata = self.app.menu.getData(self.menuRoot);
    			            console.log("m prefocus",mdata,self.menuRoot);
    			            if (mdata) {
    			                if (mdata=="loading") {
    			                    self.setLoading();
    			                } else {
    			                    self.setData(mdata);
    			                }
    			                self.refresh();
    			            }
        			        
        			        if (self.options["showOnPreFocus"]===true) {
        			            self.show();
        			        }
    			            
    			        } else if (data[0]=="current") {
    			            self.setMenuCurrent(data[1]);
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
		setMenuCurrent:function(menuCurrent) {
		    this.menuCurrent = menuCurrent;
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
		
		
		
		event : function(eventname)
		{
			// détournement d'évènements
			if (typeof this.options[eventname] === 'function')
			{
				return this.options[eventname](
							this,		// la List en cours
							eventname	// la clé de l'évènement appelant

					// réfléchir sur la possibilité de proposer en retour d'autres parametres
				);
			}
			return false;
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
    		    
    	    }
		    this.hasFocus = true;
		    this.event('onFocused');
		},
		
		onBlur:function(path) {
		    console.log("onBlur",this.id,this.options["persistFocus"]);
		    
		    this.event("onBlurring");
		    
		    if (this.options["hideOnBlur"]===true) {
		        this.hideDelayed();
		    }
		    
		    if (!this.options["persistFocus"]) {
		        $("#"+this.htmlId+" .focused").removeClass("focused");
		    }
		    
		    this.hasFocus = false;
		    var self=this;
		    this._subscribed.forEach(function(s) {
		        self.app.unsubscribe(s);
		    });
		    
		    this.event("onBlurred");
		},
		
		refresh:function(callback)
		{
		
			if ($("#"+this.htmlId).length==0)
			{
				if (this.options["autoInsert"]===true)
				{
					this.insert();
				}
			} else {
				$("#"+this.htmlId).html(this.getHtmlInner());
			}
			
			if (typeof this.options["onAfterRefresh"]==='function') { continuous = this.options["onAfterRefresh"](this); }
			if (typeof callback==='function') { callback(); }
		},
		
		show:function() {
		    $("#"+this.htmlId).css({"opacity":1}).show();
		    this.showHideSwitch.off();
		},
		hide:function() {
		    $("#"+this.htmlId).hide();
		    this.showHideSwitch.off();
		},
		processShowHide:function() {
		    if (this.nextShowHide=="show") {
		        this.show();
		    } else {
		        this.hide();
		    }
		},
		
		showDelayed:function() {
		    this.nextShowHide="show";
		    this.showHideSwitch.reset();
		},
		
		hideDelayed:function() {
		    this.nextShowHide="hide";
		    this.showHideSwitch.reset();
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
