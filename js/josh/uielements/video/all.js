(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		type:"Video",
		
		init:function() {
		    var self=this;
		    this.setDefaultPlayer(!(this.options.defaultPlayer===false));
            
            this.playingPath = false;
            
            this.app.subscribe("menuChange",function(ev,data) {
            
                //Filter only video menu items on the "current" register
                if (data[0]=="current" && self.isDefaultPlayer)
    			{
				
                    if (self.app.menu.getData(data[1]).type=="video" && self.playingPath!=data[1])
    				{
    				    self.playingPath=data[1];
                        self.play(self.app.menu.getData(data[1]));
					
    					if (self.options.HtmlTags !== undefined)
    					{
    						for(var el in self.options.HtmlTags)
    						{
    							var tag =  self.options.HtmlTags[el].split(/\s/,2)[0];
    							$(tag,'#'+self.htmlId).remove();
    							$('<'+self.options.HtmlTags[el]+'>'+ self.app.menu.getData(data[1])[el]+'</'+tag+'>').appendTo('#'+self.htmlId);
    						}
    					}
                    }
                }
    		});
    		
    		
        },
        
        getHtmlInner:function() {
            return "";
        },
        
        setDefaultPlayer:function(dft) {
            this.isDefaultPlayer = dft;
            
        }
	});
	
	
})(Joshlib,jQuery);
