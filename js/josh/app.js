(function(J,$) {
	
	J.App = J.Class({
		
		__constructor:function(appId) {
			this.menu = new J.Menu();
			this.id = appId;
		},
		
		
		setBaseHtmlId:function(eltId) {
			this.baseHtml = $("#"+eltId);
		},
		
		setBaseUIElement:function(elt) {
			this.baseUIElement = elt;
		},
		
		setDefaultVideoPlayer:function(video) {
		    this.defaultVideoPlayer = video;
		},
		
		insert:function() {
		    this.baseUIElement.insert();
		},
		
		show:function() {
		    
		}
		
	});
	
	J.Apps = {};
	
	
	
})(Joshlib,jQuery);
