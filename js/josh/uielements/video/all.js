(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		type:"Video",
		
		init:function() {
		    var self=this;
		    this.setDefaultPlayer(!(this.options.defaultPlayer===false));
            
            this.playingPath = false;
            
            this.app.subscribe("menuChange",function(ev,data) {
                var register=data[0];
                var path = data[1];
                
                //Filter only video menu items on the "current" register
                if (register=="current" && self.isDefaultPlayer)
    			{
    			    var mdata = self.app.menu.getData(path);
				
                    if (mdata.type=="video" && self.playingPath!=path)
    				{
    				    self.playingPath=path;
                        self.play(mdata);
					
    					if (self.options.HtmlTags !== undefined)
    					{
    						for(var el in self.options.HtmlTags)
    						{
    							var tag =  self.options.HtmlTags[el].split(/\s/,2)[0];
    							$(tag,'#'+self.htmlId).remove();
    							$('<'+self.options.HtmlTags[el]+'>'+ mdata[el]+'</'+tag+'>').appendTo('#'+self.htmlId);
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
