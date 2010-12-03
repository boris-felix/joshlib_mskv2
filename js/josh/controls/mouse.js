(function(J,$) {
	
	J.Controls["mouse"] = J.Class(J.Control,{
		
		start:function()
		{
			var self=this;
			$('.joshover',this.app.baseHtml[0]).live('hover click',function(event)
			{
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
						//  j'ai besoin de connaitre le retour , afin de savoir si je dois me rabattre sur "up"
						var ret = self.app.publish("control",["enter",event.currentTarget.id]);
						return false;
					}
					break; // click
				}
			});
		}
	});
	

})(Joshlib,jQuery);			