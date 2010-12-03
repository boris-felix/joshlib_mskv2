(function(J,$) {
	
	J.Controls["mouse"] = J.Class(J.Control,{
		
		start:function()
		{
			var self=this;
			$('.joshover',this.app.baseHtml[0]).live('hover click',function(event)
			{
console.log('this.app',self)
				var menuPath = $(this).attr('data-path');
			    switch (event.type)
				{
					case 'mouseenter' :
					{
						self.app.publish("control",["hover",event.currentTarget.id]);
						self.app.publish("menuGoTo",["focus",menuPath],true);
						return false;
					}
					break; // mouseenter
					case 'mouseleave' :
					break; // mouseleave
					case 'click' :
					{
						self.app.publish("control",["enter",event.currentTarget.id]);
						return false;
					}
					break; // click
				}
			});

		}
		
	});
	

})(Joshlib,jQuery);			