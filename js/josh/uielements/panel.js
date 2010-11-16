(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		type:"Panel",
		
		getHtml:function() {
			return "<div id='"+this.htmlId+"'></div>";
		}
	});
	
	
	
	
})(Joshlib,jQuery);
