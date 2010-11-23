(function(J,$) {
	
	J.Controls["keyboard"] = J.Class({
		
		__construct:function() {
			
		},
		
		start:function() {
			$('.panehere').live('mousedown MozTouchDown',function(e){
				//$(this);
				
				pane.moveTo(this.id);
				J.publish("control","enter");
				//pane.enter();
				
			});
			
		}
		
	});
	

})(Joshlib,jQuery);	