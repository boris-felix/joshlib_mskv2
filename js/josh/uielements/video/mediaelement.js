(function(J,$) {
	
	J.UI.Video = J.Class(J.UI.Video,{
		
		play:function(options) {

		    $("#"+this.htmlId)[0].innerHTML="";
				// ça ne devrait même pas exister : on cherche une id, on a qu'un seul élément en rztour.
			
			$("#"+this.htmlId)[0].innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' controls autoplay='true' autobuffer preload poster='"+options["image"]+"' />";			  
				// width='100%' height='100%'  
					/// NON ! Ne pas ! ne pas ! ne jamais ! le style doit se décider en css ou après coup dynamiquement. Jamais en dur de manière imparamétrable : on ne s'en sort jamais sinon.
            
			$('#'+this.htmlId+'_video').css({
				'width'		: (typeof this.options['width'] !== 'undefined') ? this.options['width'] : '100%',
				'height'	: (typeof this.options['height'] !== 'undefined') ? this.options['height'] : '100%',
			});
	
			//if (typeof this.options['height'] !== 'undefined') { $('#'+this.htmlId+'_video').css('height',this.options['height']); }
console.info('video elem ',this)
            
            this.mejs = new MediaElementPlayer($('#'+this.htmlId+"_video")[0],{
                pluginPath:"/swf/",
                videoWidth: $('#'+this.htmlId+"_video").width() /*+1*/,
                videoHeight: $('#'+this.htmlId+"_video").height(),
                //enablePluginDebug:true,
                success:function(me) {
                    console.log("MED SUCCESS ",me);
                    //me.play();
                }
            });
			
            window._mejs = this.mejs;
			
			$('.mejs-controls').remove();
			
			$('<div class="mejs-controls">\
					<div class="mejs-button mejs-playpause-button mejs-play"><span></span></div>\
					<div class="mejs-time"><span class="mejs-currenttime">08:10</span><span> | </span> <span class="mejs-duration">08:13</span></div>\
					<div style="width: 100%;" class="mejs-time-rail"><span style="width: 100%;" class="mejs-time-total"><span style="width: 840px;" class="mejs-time-loaded"></span><span style="width: 834.157px;" class="mejs-time-current"></span><span style="left: 827.157px;" class="mejs-time-handle"></span><span style="left: 827.157px;" class="mejs-time-float"><span class="mejs-time-float-current">08:10</span><span class="mejs-time-float-corner"></span></span></span></div>\
				</div>').appendTo('#main');
			
			
	
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
