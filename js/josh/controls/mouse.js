(function(J,$) {
	
	J.Controls["mouse"] = J.Class(J.Control,{
		
		start:function()
		{
			var self=this;
			
			$('.joshover',this.app.baseHtml[0]).live('mousedown',function(event) {
				var menuPath = $(this).attr('data-path');
			    
			    if (menuPath) {
				    self.app.publish("menuChange",["focus",menuPath]);
				}    
				
				self.app.publish("control",["enter",menuPath || event.currentTarget.id]);
				
				return false;
			});
			
			$('.joshover',this.app.baseHtml[0]).live('mouseenter',function(event) {
				var menuPath = $(this).attr('data-path') || event.currentTarget.id;
			    
			    self.app.publish("control",["hover",menuPath]);
				return false;
			});
			
			
		}
	});
	

})(Joshlib,jQuery);			