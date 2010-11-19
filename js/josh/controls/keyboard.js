(function(J,$) {
	
	J.Controls.Keyboard = J.Class({
		
		__construct:function() {
			
		},
		
		start:function() {
			$(window).bind('keydown',function(e){
				if (!e) e=window.event;
				switch(e.keyCode)
				{
					case 13 :
						//$('#cue'+pre).trigger('click');
						
						pane.enter();
						return false;
					break;
					case 27 :
						osdout();
						return false;
						// Pane.escape();
					break;
					case 32 :
						$('nav').slideDown();
						return false;
					break;
					case 37:
						pane.moveLeft();
						return false;
					break;
					case 38:
						pane.moveUp();
						return false;
						
						//$('nav').slideDown();
						//pre--;
						//if (pre<1) pre=tot;
						//moveto(pre);
					break;
					case 39:
						pane.moveRight();
						return false;
					break;
					case 40:
						pane.moveDown();
						return false;
						
						
						//$('nav').slideDown();
						//pre++;
						//if (pre>tot) pre=1;
						//moveto(pre);
					break;
				}
			});
			
		}
		
	});
	

})(Joshlib,jQuery);			