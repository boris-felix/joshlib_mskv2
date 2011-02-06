(function(J,$) {
	
	/**
     * @class Input interface for keyboards including GoogleTV special keys
     * @augments J.Input
     */
	 J.Inputs.keyboard = J.Class(J.Input,
	    {
		
		start:function() {
		    var self=this;
		    
			$(window).bind('keydown',function(e){
				if (!e) e=window.event;
				console.log("key",e.keyCode);
				switch(e.keyCode)
				{
					case 13 :
						
						self.app.publish("input",["enter"]);
						
						return false;
					break;
					case 27 :
					
					    self.app.publish("input",["exit"]);
					
						return false;
					break;
					case 32 : //space
					
					    self.app.publish("input",["enter"]);

						return false;
					break;
					case 37:
					
					    self.app.publish("input",["left"]);
					    
						return false;
					break;
					case 38:
					
					    self.app.publish("input",["up"]);
					    
						return false;
						
					break;
					case 39:
					
					    self.app.publish("input",["right"]);
					
						return false;
					break;
					case 40:
					
					    self.app.publish("input",["down"]);
					    
						return false;
						
					break;
					
					//special googletv media keys
					//http://code.google.com/tv/web/docs/implement_for_tv.html
					
					case 179:
					
					    self.app.publish("input",["play"]);
					    
						return false;
						
					break;
					
					case 178:
					
					    self.app.publish("input",["stop"]);
					    
						return false;
						
					break;
                    
				    case 176:
					
					    self.app.publish("input",["forward"]);
					    
						return false;
						
					break;
					
					case 177:
					
					    self.app.publish("input",["rewind"]);
					    
						return false;
						
					break;
					
				}
			});
			
		}
		
	});
	

})(Joshlib,jQuery);			