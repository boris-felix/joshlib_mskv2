(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		type:"Panel",
		placeholder:"",
		
		getHtml:function() { // style='display:none;'
			return "<div  id='"+this.htmlId+"'>"+(this.options["content"]?this.options["content"]:this.placeholder)+"</div>";
		}
	});
	
	
	
	
})(Joshlib,jQuery);
