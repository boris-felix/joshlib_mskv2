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
            }
        },

        init:function() {

            this.focusedIndex=null;
            this.data = [];
        },
        
        insert:function() {
            this.__base();
			
			// this.focusIndex(this.focusedIndex); // he's banned, because he's firing onFocus(ed|ng) events when we don't need them
			
			this.focusedIndex=0;
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
			if (this.data.length==0)
			{
				console.info('Data de la List actuellement vide ',this);
				if (typeof this.options['placeholder']=='function')
				{
					return this.options['placeholder']();
				} else {
					return this.options['placeholder'];
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
						    //todo merge previous/nextmoving
						    // mouse hover is disabled for now
							//self.event('onPreviousMoving');
							//self.app.publish("menuGoTo",["focus",self.menuRoot+self.data[parseInt(data[1].split("_").pop())]["id"]]);
							//self.event('onPreviousMoved');
							//
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
							self.event('onPanelChilding');
							self.onBlur();
							self.app.publish("menuGo",["focus","down"]);
							self.event('onPanelChilded');

							/// faudrait en async J.publish("menuGo",["current","down"]);
						}
						break; // up
						case 'enter':
						{
						    if (!self.hasFocus && !data[1]) return false;
							
							if (data[1]) {
							    var dest = self.menuRoot+self.data[parseInt(data[1].split("_").pop())]["id"];
							} else {
							    var dest = self.menuRoot+self.data[self.focusedIndex]["id"];
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
		
		setLoading:function() {
		    console.log("LOADING",this.id);
		    $("#"+this.htmlId)[0].innerHTML = "<li width='100%'>Loading...</li>";
		},
		
		onFocus:function(path)
		{
		    this.event('onFocusing');
		    //todo use menuentry.fullId() to get the index
		    
		    var id = path.split("/").pop();
		    
		    for (var i=0;i<this.data.length;i++) {
		        if (id==this.data[i].id) {
		            this.focusIndex(i);
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
		        $("#"+this.htmlId+'_'+this.focusedIndex).removeClass("focused");
		        if ($(".focused").length>0)
				{
					console.debug("There was more than one .focused! Lost some nav events?",$(".focused"));
		            $(".focused").removeClass('focused');
		        }
		    }
		    
		    this.focusedIndex=index;
		    
		    $("#"+this.htmlId+'_'+index).addClass("focused");
			this.event('onFocusIndexed');
		}
	});
	
	
})(Joshlib,jQuery);