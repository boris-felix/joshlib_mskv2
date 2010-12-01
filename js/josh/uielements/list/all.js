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
		placeholder:'',

        defaultOptions:{
            //where is the tree unfolding to
            "orientation":"up",
            "itemTemplate":function(self,htmlId,data) {
				/** TODO itemTemplate comme étant un string . Principalement pour simplifer le bousin pour les pas trop développeurs
						if (typeof itemTemplate==='string')
						{
							
							this.forEach{
								this.replace('<<'+tag'>>',data[tag])
							}
						}
				 **/
				
                return "<li id='"+htmlId+"'><img src='"+data["image"]+"' /><br/>"+data["label"]+"</li>";
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

		getHtml:function() {

			
			var ret = ["<ul id='"+this.htmlId+"' style='display:none;'>"];
			if (this.data.length==0)
			{
				console.info('Data de la List actuellement vide ',this);
				if (typeof this.placeholder=='function')
				{
					ret.push(this.placeholder());
				} else {
					ret.push(this.placeholder);
				}
			} else {
			
				for (var i=0;i<this.data.length;i++)
				{
					ret.push(this.options["itemTemplate"](this,this.htmlId+"_"+i,this.data[i]));
				}
			}
			ret.push("</ul>");
			return ret.join("");
		},
		
		event : function(eventname)
		{
			// détournement d'évènements
			if (typeof this.options[eventname] === 'function')
			{
				this.options[eventname](
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
		           switch (data)
				   {
						case 'left':
						{
							self.event('onPreviousMoving');
						    J.publish("menuGo",["focus","prev"]);
							//self.focusIndex((self.focusedIndex==0)?0:(self.focusedIndex-1));
							self.event('onPreviousMoved');
						}
						break; // left
						case 'right':
						{
							self.event('onNextMoving');
						    J.publish("menuGo",["focus","next"]);
							//self.focusIndex((self.focusedIndex==(self.data.length-1))?self.focusedIndex:(self.focusedIndex+1));
							self.event('onNextMoved');
						}
						break; // right
						case 'down':
						case 'exit':
						{
							self.event('onPanelExiting');
							self.onBlur();
							J.publish("menuGo",["focus","up"]);
							self.event('onPanelExited');
						}
						break; // down , exit
						case 'up':
						{
							self.event('onPanelChilding');
							self.onBlur();
							J.publish("menuGo",["focus","down"]);
							self.event('onPanelChilded');
							/// faudrait en async J.publish("menuGo",["current","down"]);
						}
						break; // up
						case 'enter':
						{
							self.event('onPanelActing');
							J.publish("menuGoTo",["current",self.menuRoot+self.data[self.focusedIndex]["id"]]);
							self.event('onPanelActed');
						}
						break; // enter
				   }
		          
		        }]
		    ]);
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
		},
		
		setData:function(menuRoot,data) {
		    this.menuRoot = menuRoot;
			this.data = data;
		}
	});
	
	
	
	
})(Joshlib,jQuery);
