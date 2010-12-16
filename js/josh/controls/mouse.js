(function(J,$) {
	
	J.Controls["mouse"] = J.Class(J.Control,{
		
		start:function()
		{
			var self=this;
			
			$('.joshover',this.app.baseHtml[0]).live('mousedown',function(event) {
				var menuPath = $(this).attr('data-path');
			    console.log("click",menuPath);
			    if (menuPath) {
				    self.app.publish("menuGoTo",["focus",menuPath],true);
				}    
				
				setTimeout(function() {
				    
				    //If we didn't auto-child
				    console.log("autochild?",self.app.menu.getRegister("focus"),menuPath);
				    
				    if (self.app.menu.getRegister("focus")==menuPath || !menuPath) {
				        self.app.publish("control",["enter"]); //,menuPath || event.currentTarget.id]);
				    }
				},100);
				
				
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