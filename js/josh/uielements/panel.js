(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		type:"Panel",
		
		getHtml:function() {
			return "<div style='display:none;' id='"+this.htmlId+"'>"+(this.options["content"]?this.options["content"]:"")+"</div>";
		}
	});
	
	
	
	
})(Joshlib,jQuery);
