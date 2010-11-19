(function(J,$) {
	
	J.Controls["mouse"] = J.Class({
		
		__construct:function() {
			
		},
		
		start:function()
		{
			$('.panehere').live('hover',function()
			{
				pane.moveTo(this.id);
			});

			$('*').live('click',function()
			{
				//pane.action()
			});

		}
		
	});
	

})(Joshlib,jQuery);			