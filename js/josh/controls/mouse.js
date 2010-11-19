(function(J,$) {
	
	J.Controls.Mouse = J.Class({
		
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
				pane.enter();
			});

		}
		
	});
	

})(Joshlib,jQuery);			