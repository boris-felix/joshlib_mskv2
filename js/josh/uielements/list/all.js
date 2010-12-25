(function(J,$) {
	
	var orientations = ["up","right","down","left"];
	var inv = {
	    "up":"down",
	    "down":"up",
	    "left":"right",
	    "right":"left"
	};
	
	
	/**
     * Class description
     * @class
     * @augments J.UIElement
     */
	J.UI.List = J.Class(J.UIElement,{
        type:"List",
		data:[],
		HtmlTag:'ul ', // style="display:none;"
						// associer un style en dur est une très mauvaise idée : elle m'a fait tourner en rond une journée complète. Vaut mieux utiliser les events pour forcer le style.

        defaultOptions:{
            //where is the tree unfolding to
            "orientation":"up",
            "persistFocus":true,
            "itemTemplate":function(self,htmlId,data)
			{
				/** TODO itemTemplate comme étant un string . Principalement pour simplifer le bousin pour les pas trop développeurs
						if (typeof itemTemplate==='string')
						{
							
							this.forEach{
								this.replace('<<'+tag'>>',data[tag])
							}
						}
				 **/
				
                return "<li id='"+htmlId+"' data-path='"+self.menuRoot+data.id+"' class='joshover'><img src='"+data["image"]+"' /><br/>"+data["label"]+"</li>";
            },
            "loadingTemplate":function(self) {
                return "<li class='loading'>Loading...</li>";
            }
        },

        init:function() {
            this.isLoading=true;
            this.focusedIndex=null;
            this.data = [];
            this.id2index = {};
            
            var self=this;
     		this.grid = new J.Grid({
    		    "grid":[
    		        []
    		    ],
    		    "dimensions":2,
                "onChange":function(coords,elem) {
                    console.log("onChange",coords,elem);
                    self.focusIndex(coords[0]);
                },
                "onExit":function(side) {
                    //go to leaf
                    console.log("onExit",side);
                    if (side[1]>0) {
                        
                        if (!self.event('onPanelChilding')) {
						    self.onBlur();
							self.app.publish("menuGo",["focus","down"]);
							self.event('onPanelChilded');
						}
                        
                    //go to parent
                    } else if (side[1]<0) {
                        if (self.menuRoot=='/') return false;
                        self.event('onPanelExiting');
						self.onBlur();
                        self.app.publish("menuGo",["focus","up"]);
                        self.event('onPanelExited');
                        
                    }
                },
                "orientation":this.options.orientation
    		});
        },
        
        insert:function() {
            this.__base();
			
			// this.focusIndex(this.focusedIndex); // he's banned, because he's firing onFocus(ed|ng) events when we don't need them
			
			//$("#"+this.htmlId+'_0').addClass("focused");
        },
		
		getHtmlOpeningTag:function()
		{
			return '<'+this.HtmlTag+' id="'+this.htmlId+'" style="display:none">';
		},

		getHtmlClosingTag:function()
		{
			return '</'+this.HtmlTag.split(/\s/,2)[0]+'>';
		},
		
		getHtmlInner:function()
		{
			if (this.isLoading)
			{
				if (typeof this.options["loadingTemplate"]=="function") {
				    return this.options["loadingTemplate"](this);
				} else {
				    return this.options["loadingTemplate"];
				}
				
			} else {
				var ret =[];
				for (var i=0;i<this.data.length;i++)
				{
					ret.push(this.options["itemTemplate"](this,this.htmlId+"_"+i,this.data[i]));
				}
				return ret.join("");
			}
		},

		getHtml:function()
		{
			return this.getHtmlOpeningTag() + this.getHtmlInner() + this.getHtmlClosingTag();
		},
		
		setMenuRoot:function(menuRoot) {
		    this.__base(menuRoot.replace(/\/[^\/]*$/,"/"));
		},
		
		
		subscribes:function() {
		    
		    var self=this;
		    return this.__base().concat([
		        ["control",function(ev,data) {
		            //only supports orientation=="up" for now
		            var sens=data[0];
					
					 /// rtl langages for arabic, hebrew, hindi and japanese
					if ((self.options.browsingSense=='locale') && (document.dir=='rtl'))
					{
						switch (sens)
						{
							case 'left': sens = 'right';	break;
							case 'right': sens = 'left';	break;
						}
					}
					console.log("receiveControl",self.id,data);
		        
		        
		           if (sens=="hover") {
		               var split = data[1].split("/");
					    var lastPath = split[split.length-1];
					    if (data[1].indexOf(self.menuRoot)===0) {
					        var subPath = data[1].substring(self.menuRoot.length);
					        if (subPath.indexOf("/")===-1) {
					            if (self.id2index[subPath]!==undefined) {
					                self.grid.goTo([self.id2index[subPath],0]);
					            }
					        }
					    }
		               
		           } else if (sens=="left" || sens=="right" || sens=="down" || sens=="up") {
		               if (!self.hasFocus) return false;
		               self.grid.go(sens);
		               
		           } else if (sens=="enter") {

                        var dest = false;
 
                        if (data[1]) {
                            var split = data[1].split("/");
                            var lastPath = split[split.length-1];
                            if (data[1].indexOf(self.menuRoot)===0) {
                                var subPath = data[1].substring(self.menuRoot.length);
                                if (subPath.indexOf("/")===-1) {
                                    if (self.id2index[subPath]!==undefined) {
                                        dest = self.menuRoot+self.data[self.id2index[subPath]]["id"];
                                    }
                                }
                            }
                            if (!dest) {
                                return;
                            }
                        } else {
                            if (!self.hasFocus && !data[1]) return false;
    
                            if (self.isLoading) return false;
    
                            dest = self.menuRoot+self.data[self.focusedIndex]["id"];
                        }

                        self.event('onPanelActing');
   
                        self.app.publish("menuGoTo",["current",dest]);

                        self.event('onPanelActed');
 
		           }
		           
						    
		        }]
		    ]);
		},
		
		refresh:function() {
		    this.__base();
		    if (this.options["persistFocus"] && this.focusedIndex!==null) {
		        $("#"+this.htmlId+'_'+this.focusedIndex).addClass("focused");
		    }
		},
		
		setLoading:function() {
		    console.log("LOAD",this.id);
		    this.isLoading=true;
		},
		
		setData:function(data) {
		    this.__base(data);
		    
			//todo: do this in menu
			for (var i=0;i<data.length;i++) {
			    this.id2index[data[i].id]=i;
			}
			
			this.grid.setGrid([data]);
			this.grid.currentCoords=false;
		},
        /*
        onBlur:function(path) {
            this.grid.currentCoords=false;
            this.__base(path);
        },
		*/
		onFocus:function(path)
		{

		    if (path.charAt(path.length-1)=="/") {
		        this.grid.goTo([0,0]);
		    } else {
		        var id = path.split("/").pop();
		        var index=this.id2index[id];
                this.grid.goTo([index,0]);
		    }
		    
		   
		    this.__base(path);
		},
		
		focusIndex:function(index)
		{
		    
		    if (this.focusedIndex!==null)
			{
		        $("#"+this.htmlId+" .focused").removeClass("focused");
		    }
		    
		    this.focusedIndex=index;
		    this.app.publish("menuGoTo",["focus",this.menuRoot+this.data[this.focusedIndex].id],true);
		    
		    $("#"+this.htmlId+'_'+index).addClass("focused");

		}
	});
	
	
})(Joshlib,jQuery);