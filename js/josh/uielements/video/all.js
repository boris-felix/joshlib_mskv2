(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		type:"Video",
		
		init:function() {
		    var self=this;
		    this.setDefaultPlayer(!(this.options.defaultPlayer===false));
            
        },
        
        getHtmlInner:function() {
            return "";
        }
	});
	
	
})(Joshlib,jQuery);
