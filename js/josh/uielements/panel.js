(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		
		getHtml:function() {
			return "<div id='"+this.elementId+"'></div>";
		}
	},{
		type:"Panel"
	});
	
	
	
	
})(Joshlib,jQuery);
