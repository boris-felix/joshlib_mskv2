(function(J,$) {
	
	J.Controls["keyboard"] = J.Class(J.Control,{
		

		start:function() {
		    var self=this;
		    

			$(window).bind('keydown',function(e){
				if (!e) e=window.event;
				console.log("key",e.keyCode);
				switch(e.keyCode)
				{
					case 13 :
						
						self.app.publish("control",["enter"]);
						
						return false;
					break;
					case 27 :
					
					    self.app.publish("control",["exit"]);
					
						return false;
					break;
					case 32 : //space
					
					    self.app.publish("control",["enter"]);

						return false;
					break;
					case 37:
					
					    self.app.publish("control",["left"]);
					    
						return false;
					break;
					case 38:
					
					    self.app.publish("control",["up"]);
					    
						return false;
						
					break;
					case 39:
					
					    self.app.publish("control",["right"]);
					
						return false;
					break;
					case 40:
					
					    self.app.publish("control",["down"]);
					    
						return false;
						
					break;
					
					//special googletv media keys
					//http://code.google.com/tv/web/docs/implement_for_tv.html
					
					case 179:
					
					    self.app.publish("control",["play"]);
					    
						return false;
						
					break;
					
					case 178:
					
					    self.app.publish("control",["stop"]);
					    
						return false;
						
					break;
                    
				    case 176:
					
					    self.app.publish("control",["next"]);
					    
						return false;
						
					break;
					
					case 177:
					
					    self.app.publish("control",["prev"]);
					    
						return false;
						
					break;
					
				}
			});
			
		}
		
	});
	

})(Joshlib,jQuery);			