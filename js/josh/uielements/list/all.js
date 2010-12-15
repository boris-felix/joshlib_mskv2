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
				return this.options["loadingTemplate"](this);
				
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
		    this.menuRoot = menuRoot.replace(/\/[^\/]*$/,"/");
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
		            
		           switch (sens)
				   {
				        case 'hover':
						{
						    var split = data[1].split("/");
						    var lastPath = split[split.length-1];
						    if (data[1].indexOf(self.menuRoot)===0) {
						        var subPath = data[1].substring(self.menuRoot.length);
						        if (subPath.indexOf("/")===-1) {
						            if (self.id2index[subPath]!==undefined) {
						                self.app.publish("menuGoTo",["focus",self.menuRoot+self.data[self.id2index[subPath]]["id"]]);
						            }
						        }
						    }
						}
						break; // left
						case 'left':
						{
						    if (!self.hasFocus) return false;
										
							self.event('onPreviousMoving');
						    self.app.publish("menuGo",["focus","prev"]);
							self.event('onPreviousMoved');
						}
						break; // left
						case 'right':
						{
						    if (!self.hasFocus) return false;
							self.event('onNextMoving');
						    self.app.publish("menuGo",["focus","next"]);
							self.event('onNextMoved');
						}
						break; // right
						case 'down':
						case 'exit':
						{
						    if (!self.hasFocus) return false;
							// si on est pas au TOUT PREMIER NIVEAU (sinon on atteri nulle part)
							//if (/^\/\w+\/$/.test(self.menuRoot)) return;
							if (self.menuRoot=='/') return false;
							self.event('onPanelExiting');
							self.onBlur();
							self.app.publish("menuGo",["focus","up"]);
							self.event('onPanelExited');
						}
						break; // down , exit
						case 'up':
						{
						    if (!self.hasFocus) return false;
							
							if (!self.event('onPanelChilding')) {
							    self.onBlur();
    							self.app.publish("menuGo",["focus","down"]);
    							self.event('onPanelChilded');
							}
							

							/// faudrait en async J.publish("menuGo",["current","down"]);
						}
						break; // up
						case 'enter':
						{
						    
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
							    dest = self.menuRoot+self.data[self.focusedIndex]["id"];
							}
							
							//if (self.app.menu.getRegister("current")!=dest) {
							    
							    self.event('onPanelActing');
                                
							    self.app.publish("menuGoTo",["current",dest]);
							
							    self.event('onPanelActed');
							//}
						}
						break; // enter
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
		    this.isLoading=true;
		},
		
		setData:function(data) {
		    this.isLoading=false;
			this.data = data;
			
			//todo: do this in menu
			for (var i=0;i<data.length;i++) {
			    this.id2index[data[i].id]=i;
			}
		},
        
		
		onFocus:function(path)
		{
		    this.event('onFocusing');
		    
		    if (path.charAt(path.length-1)=="/") {
		        this.focusIndex(0);
		    } else {
		         //todo use menuentry.fullId() to get the index
                
        		var id = path.split("/").pop();
                
        		for (var i=0;i<this.data.length;i++) {
        		    if (id==this.data[i].id) {
        		        this.focusIndex(i);
        		    }
        		}
		    }
		    
		   
		    this.__base();
			this.event('onFocused');
		},
		
		focusIndex:function(index)
		{
			this.event('onFocusIndexing');
		    if (this.focusedIndex!==null)
			{
		        $("#"+this.htmlId+" .focused").removeClass("focused");
		    }
		    
		    this.focusedIndex=index;
		    
		    $("#"+this.htmlId+'_'+index).addClass("focused");
			this.event('onFocusIndexed');
		}
	});
	
	
})(Joshlib,jQuery);