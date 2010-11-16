(function(J,$) {
	
	J.UI.Video = J.Class(J.UIElement,{
		
		play:function(url) {
		    
		    //https://github.com/maccman/flarevideo
		    
			this.flare = $("#video").flareVideo();
            this.flare.load([
                    {
                      src:  url,
                      type: 'video/mp4',
                      autoplay:true
                      
                    }
                  ]);
		},
		
		pause:function() {
		    this.flare.pause();
	    }
		
	},{
		type:"Video"
	});
	
	
})(Joshlib,jQuery);
