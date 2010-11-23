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
            "orientation":"up"
        },
        
		
		
        init:function() {

            this.focusedIndex=null;
            this.data = [];
        },

		getHtml:function() {
			
			var ret = ["<ul id='"+this.htmlId+"'>"];
			var prev_showid;

			for (var i=0;i<this.data.length;i++)
			{
			    ret.push("<li id='"+this.htmlId+"_"+i+"'>"+this.data[i]["label"]+"</li>");
			}
			ret.push("</ul>");
			return ret.join("");
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
							self.focusIndex((self.focusedIndex==0)?0:(self.focusedIndex-1));
						}
						break; // left
						case 'right':
						{
							self.focusIndex((self.focusedIndex==(self.data.length-1))?self.focusedIndex:(self.focusedIndex+1));
						}
						break; // right
						case 'down':
						case 'exit':
						{
							self.onBlur();
							J.publish("menuGo",["focus","up"]);
						}
						break; // down , exit
						case 'up':
						{
							self.onBlur();
							J.publish("menuGo",["focus","down"]);
							
							/// faudrait en async J.publish("menuGo",["current","down"]);
						}
						break; // up
						case 'enter':
						{
							J.publish("menuGoTo",["current",self.menuRoot+self.data[self.focusedIndex]["id"]]);
						}
						break; // enter
				   }
		          
		        }]
		    ]);
		},
		
		focusIndex:function(index) {
		    if (this.focusedIndex!==null)
			{
		        $("#"+this.htmlId+'_'+this.focusedIndex).removeClass("focused");
		        if ($(".focused").length>0)
				{
		            $(".focused").remove();
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
