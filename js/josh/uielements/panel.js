(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		type:"Panel",
		placeholder:"",
		
		getHtml:function() {
			return "<div style='display:none;' id='"+this.htmlId+"'>"+(this.options["content"]?this.options["content"]:this.placeholder)+"</div>";
		}
	});
	
	
	
	
})(Joshlib,jQuery);
