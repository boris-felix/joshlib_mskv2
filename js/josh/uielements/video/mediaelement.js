(function(J,$) {
	
	J.UI.Video = J.Class(J.UI.Video,{
		
		play:function(options) {

		    $("#"+this.htmlId)[0].innerHTML="";
				// ça ne devrait même pas exister : on cherche une id, on a qu'un seul élément en rztour.
			
			$("#"+this.htmlId)[0].innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' controls autoplay='true' autobuffer preload poster='"+options["image"]+"' />";			  
				// width='100%' height='100%'  
					/// NON ! Ne pas ! ne pas ! ne jamais ! le style doit se décider en css ou après coup dynamiquement. Jamais en dur de manière imparamétrable : on ne s'en sort jamais sinon.
            
console.info('video elem ',this)
            
            this.mejs = new MediaElementPlayer($('#'+this.htmlId+"_video")[0],{
                pluginPath:"/swf/",
                videoWidth: (typeof this.options['width'] !== 'undefined') ? this.options['width'] : $('#'+this.htmlId+"_video").parent().width()+1,
                videoHeight: (typeof this.options['height'] !== 'undefined') ? this.options['height'] : $('#'+this.htmlId+"_video").parent().height(),
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
