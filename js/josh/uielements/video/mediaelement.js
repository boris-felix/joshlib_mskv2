(function(J,$) {
	
	J.UI.Video = J.Class(J.UI.Video,{
		
		play:function(options) {

		    $("#"+this.htmlId)/*[0]*/.innerHTML="";
				// ça ne devrait même pas exister : on cherche une id, on a qu'un seul élément en ertour.
			
			$("#"+this.htmlId)/*[0]*/.innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' controls autoplay='true' autobuffer preload poster='"+options["image"]+"' />";			  // NON ! Ne pas ! ne pas ! ne jamais ! width='100%' height='100%' 
            
console.info('video elem ','#'+this.htmlId+"_video",$('#'+this.htmlId+"_video")/*[0]*/)
            
            this.mejs = new MediaElementPlayer($('#'+this.htmlId+"_video")/*[0]*/,{
                pluginPath:"/swf/",
                videoWidth:$('#'+this.htmlId+"_video").width()+1,
                videoHeight:$('#'+this.htmlId+"_video").height(),
                //enablePluginDebug:true,
                success:function(me) {
                    console.log("MED SUCCESS ",me);
                    me.play();
                }
            });
			
            window._mejs = this.mejs;
	
		},
		
		pause:function() {
		    this.mejs.pause();
	    },
	    
	    getHtml:function() {
			// BUG typiquement ce qui est royalement pénible : les styles embarqués. Je pense qu'il vaut mieux insérer le html, et ensuite utiliser hide()
			// ça m'a quand même foutu en l'air une journée ces bétises.
			return "<div id='"+this.htmlId+"'></div>"; //style='display:none;' 
		}
		
	});
	
	
})(Joshlib,jQuery);
