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
		            
		            if (data=="left") {
		                self.focusIndex(self.focusedIndex-1);
		            } else if (data=="right") {
		                self.focusIndex(self.focusedIndex+1);
	                } else if (data=="down" || data=="exit") {
	                    self.onBlur();
	                    J.publish("menuFocus","back");
                    } else if (data=="up") {
                        self.onBlur();
                        J.publish("menuFocus","forward");
                    } else if (data=="enter") {
                        J.publish("menuSelect",self.menuRoot+"/"+self.data[self.focusedIndex]["id"]);
                    }
		        }]
		    ]);
		},
		
		focusIndex:function(index) {

		    if (this.focusedIndex!==null) {
		        $("#"+this.htmlId+'_'+this.focusedIndex).removeClass("focused");
		    }
		    
		    this.focusedIndex=index;
		    
		    $("#"+this.htmlId+'_'+index).addClass("focused");
		},
		
		setData:function(menuRoot,data) {
		    this.menuRoot = menuRoot;
			this.data = data;
		},
		
		refreshHtml : function() {
			// euh, en fait, c'est complètement xstupiude, ce que je fais ici....
			
			//console.log(this.getHtml());
			//document.getElementById(this.htmlId).outerHTML=       this.getHtml();
		}
		
	});
	
	
	
	
})(Joshlib,jQuery);
