(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		type:"Video",
		
		init:function() {
		    var self=this;
            J.subscribe("menuChange",function(ev,data) {
                
                //Filter only video menu items on the "current" register
                if (data[0]=="current") {
                    
                    if (self.app.menu.getData(data[1]).type=="video") {
                        
                        self.play(self.app.menu.getData(data[1]));
                    }
                    
                }
                
			});
            
        }
	});
	
	
})(Joshlib,jQuery);
