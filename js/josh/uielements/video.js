(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		type:"Video",
		
		play:function(options) {
		    
		    //https://github.com/maccman/flarevideo
		    
			this.flare = $("#"+this.htmlId).flareVideo();
            this.flare.load([
                    {
                      src:  options["url"],
                      type: options["mime"] || 'video/mp4',
                      autoplay:true
                      
                    }
                  ]);
		},
		
		pause:function() {
		    this.flare.pause();
	    },
	    
	    getHtml:function() {
			return "<div id='"+this.htmlId+"'></div>";
		}
		
	});
	
	
})(Joshlib,jQuery);
