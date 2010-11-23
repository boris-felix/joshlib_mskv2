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
		            //console.log("got control",data);
		            
		            if (data=="left") {
		                self.focusIndex(self.focusedIndex-1);
		            } else if (data=="right") {
		                self.focusIndex(self.focusedIndex+1);
	                } else if (data=="down" || data=="exit") {
	                    self.onBlur();
	                    J.publish("menuGo",["focus","up"]);
                    } else if (data=="up") {
                        self.onBlur();
                        J.publish("menuGo",["focus","down"]);
                    } else if (data=="enter") {
                        J.publish("menuGoTo",["current",self.menuRoot+self.data[self.focusedIndex]["id"]]);
                    }
		        }]
		    ]);
		},
		
		focusIndex:function(index) {
            console.log(index);
		    if (this.focusedIndex!==null) {
		        $("#"+this.htmlId+'_'+this.focusedIndex).removeClass("focused");
		        if ($(".focused").length>0) {
		            $(".focused").remove();
		            console.log("Lost some nav events?");
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
