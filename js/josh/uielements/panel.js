(function(J,$) {
	
	J.UI.Panel = J.Class(J.UIElement,{
		
		insert:function() {
			var elt = $("<div id='"+this.elementId+"'></div>");
			this.app.baseElement.appendChild(elt);
		}
	},{
		type:"Panel"
	});
	
	
	
	
})(Joshlib,jQuery);
