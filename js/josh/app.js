(function(J,$) {
	
	J.App = J.Class({
		
		__construct:function(appId) {
			this.menu = new J.Menu();
			this.id = appId;
		},
		
		
		setBaseElementId:function(eltId) {
			this.baseElement = $("#"+eltId)[0];
		},
		
		setDefaultVideoPlayer:function(video) {
		    this.defaultVideoPlayer = video;
		}
		
	});
	
	
	
	
})(Joshlib,jQuery);
