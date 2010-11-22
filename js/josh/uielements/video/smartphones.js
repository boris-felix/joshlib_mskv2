(function(J,$) {
	
	J.UI.Video = J.Class(J.UI.Video,{
	
		play:function(options) {
		    
		    window.open(options["url"]);
		    
		},
		
		pause:function() {
		    return;
	    },
	    
	    getHtml:function() {
			return "";
		}
		
	});
	
	
})(Joshlib,jQuery);
