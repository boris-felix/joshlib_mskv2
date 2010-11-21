(function(J,$) {
	
	J.Controls["keyboard"] = J.Class({
		
		__construct:function() {
			
		},
		
		start:function() {
			$(window).bind('keydown',function(e){
				if (!e) e=window.event;
				switch(e.keyCode)
				{
					case 13 :
						
						J.publish("control","enter");
						
						return false;
					break;
					case 27 :
					
					    J.publish("control","exit");
					
						return false;
					break;
					case 32 :
					
					    J.publish("control","down");

						return false;
					break;
					case 37:
					
					    J.publish("control","left");
					    
						return false;
					break;
					case 38:
					
					    J.publish("control","up");
					    
						return false;
						
					break;
					case 39:
					
					    J.publish("control","right");
					
						return false;
					break;
					case 40:
					
					    J.publish("control","down");
					    
						return false;
						
					break;
				}
			});
			
		}
		
	});
	

})(Joshlib,jQuery);			