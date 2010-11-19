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
						$('#cue'+pre).trigger('click');
						
						// Pane.enter();
					break;
					case 27 :
						osdout();
						
						// Pane.escape();
					break;
					case 32 :
						$('nav').slideDown();
					break;
					case 37:
					case 38:
						// Pane.moveLeft();
						
						
						$('nav').slideDown();
						pre--;
						if (pre<1) pre=tot;
						moveto(pre);
					break;
					case 39:
					case 40:
						// Pane.moveRight();
						
						
						$('nav').slideDown();
						pre++;
						if (pre>tot) pre=1;
						moveto(pre);
					break;
				}
			});
			
		}
		
	});
	

})(Joshlib,jQuery);			