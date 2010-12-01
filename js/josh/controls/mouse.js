(function(J,$) {
	
	J.Controls["mouse"] = J.Class(J.Control,{
		
		start:function()
		{
			$('.joshover',this.app.baseHtml[0]).live('hover click',function(event)
			{
			    //console.log(event);
			    if (event.type=="mouseenter") {
			        J.publish("control",["hover",event.currentTarget.id]);
			        return false;
			    } else if (event.type=="mouseleave") {
			        
			    } else if (event.type=="click") {
			        J.publish("control",["enter",event.currentTarget.id]);
			        return false;
			    }
			});

		}
		
	});
	

})(Joshlib,jQuery);			