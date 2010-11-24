(function(J,$) {
	
	var orientations = ["up","right","down","left"];
	var inv = {
	    "up":"down",
	    "down":"up",
	    "left":"right",
	    "right":"left"
	};
	
	J.UI.List = J.Class(J.UIElement,{
        type:"List",
		data:[],

        defaultOptions:{
            //where is the tree unfolding to
            "orientation":"up",
            "itemTemplate":function(self,htmlId,data) {
                return "<li id='"+htmlId+"'><img src='"+data["image"]+"' /><br/>"+data["label"]+"</li>";
            }
        },
        
		
		
        init:function() {

            this.focusedIndex=null;
            this.data = [];
        },

		getHtml:function() {
			
			var ret = ["<ul id='"+this.htmlId+"' style='display:none;'>"];
			var prev_showid;
            

			for (var i=0;i<this.data.length;i++)
			{
			    ret.push(this.options["itemTemplate"](this,this.htmlId+"_"+i,this.data[i]));
			}
			
			ret.push("</ul>");
			return ret.join("");
		},
		
		event : function(eventname)
		{
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
						    //J.publish("menuGo",["focus","left"]);
							self.focusIndex((self.focusedIndex==0)?0:(self.focusedIndex-1));
							self.event('onPreviousMoved');
						}
						break; // left
						case 'right':
						{
							self.event('onNextMoving');
						    //J.publish("menuGo",["focus","right"]);
							self.focusIndex((self.focusedIndex==(self.data.length-1))?self.focusedIndex:(self.focusedIndex+1));
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
		
		
		onFocus:function() {
		    this.__base();
		    this.focusIndex(0);
		},
		
		focusIndex:function(index) {

		    if (this.focusedIndex!==null)
			{
		        $("#"+this.htmlId+'_'+this.focusedIndex).removeClass("focused");
		        if ($(".focused").length>0)
				{
		            $(".focused").removeClass('focused');
console.info("Lost some nav events?");
		        }
		    }
		    
		    this.focusedIndex=index;
		    
		    $("#"+this.htmlId+'_'+index).addClass("focused");
		},
		
		setData:function(menuRoot,data) {
		    this.menuRoot = menuRoot;
			this.data = data;
		}
	});
	
	
	
	
})(Joshlib,jQuery);
