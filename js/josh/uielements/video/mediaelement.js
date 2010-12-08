(function(J,$) {

	J.UI.Video = J.Class(J.UI.Video,{
		
		delegated : function(event,self) {
			if (typeof this.options[event]=='function')
			{
				return this.options[event]();
			}
		},
		
		play:function(options) {

		    $("#"+this.htmlId)[0].innerHTML="";
				// ça ne devrait même pas exister : on cherche une id, on a qu'un seul élément en rztour.
			
			$("#"+this.htmlId)[0].innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' controls autoplay='true' autobuffer preload poster='"+options["image"]+"' />";			  
				// width='100%' height='100%'  
					/// NON ! Ne pas ! ne pas ! ne jamais ! le style doit se décider en css ou après coup dynamiquement. Jamais en dur de manière imparamétrable : on ne s'en sort jamais sinon.
            
			$('#'+this.htmlId+'_video').css({
				'width'		: (typeof this.options['width'] !== 'undefined') ? this.options['width'] : '100%',
				'height'	: (typeof this.options['height'] !== 'undefined') ? this.options['height'] : '100%',
				'z-index'   : 00
			});
	
			//if (typeof this.options['height'] !== 'undefined') { $('#'+this.htmlId+'_video').css('height',this.options['height']); }
            
console.info('play',options["url"])
			
			var that=this;
            this.mejs = new MediaElementPlayer($('#'+this.htmlId+"_video")[0],{
                pluginPath:"/swf/",
                videoWidth: $('#'+this.htmlId+"_video").width() /*+1*/,
                videoHeight: $('#'+this.htmlId+"_video").height(),
                //enablePluginDebug:true,
                success:function(me) {
                    console.log("MED SUCCESS ",me);
					/*$('.mejs-controls').remove();*/
					that.delegated('success');
console.log('that',that);
console.log('that.mejs',that.mejs);
//console.log('that.mejs.media',that.mejs.media);
                    me.play();
					me.addEventListener('progress',function(ev){
						// 100 * _mejs.media.currentTime / _mejs.media.duration;
						$('.video-duration').text(isNaN(me.duration)?'--:--':   mejs.Utility.secondsToTimeCode(me.duration));
						$('.video-time-loaded').css('width',Math.round(100 * me.bufferedBytes / me.bytesTotal)+'%');
						that.delegated('progress');
					});
					me.addEventListener('timeupdate',function(ev){
						$('.video-currenttime').text(mejs.Utility.secondsToTimeCode(me.currentTime));
						$('.video-time-current').css('width',Math.round(100 * me.currentTime / me.duration)+'%');
						that.delegated('timeupdate');
					});
					me.addEventListener('ended',function(ev){
						//$('.video-duration').text(mejs.Utility.secondsToTimeCode(_mejs.media.duration));
						//REPLAY ?
						$('.video-play , .video-play').hide();
						$('.video-stop').show();
						that.delegated('ended');
					});
					
					me.addEventListener('canplay',function(ev){
						// théoriquement jamais atteint
						
					});
				}
            })
			
            window._mejs = this.mejs;

			$('.video-controls').remove();
			
			$('<div class="video-controls">\
					<div class="video-buttons">\
						<span class="video-button video-previous">▐◀</span>\
						<span class="video-button video-reward">◀◀ </span>\
						<span class="video-button video-play">▶</span>\
						<span class="video-button video-pause">▌▌</span>\
						<span class="video-button video-stop">▐▌</span>\
						<span class="video-button video-foward">▶▶</span>\
						<span class="video-button video-next">▶▌</span>\
						<span class="video-time"><span class="video-currenttime">00:00</span> / <span class="video-duration">00:00</span></span>\
					</div>\
					<div class="video-time-rail"><span class="video-time-total"><span class="video-time-loaded"></span><span class="video-time-current"></span></div>\
				</div>').appendTo('#main');
				/* <span style="left: 827.157px;" class="video-time-handle"></span><span style="left: 827.157px;" class="video-time-float"><span class="video-time-float-current">08:10</span><span class="video-time-float-corner"></span></span></span> */
			
			$('.video-previous').click(function(){
				//_mejs.currentTime = 0; // eeeeeh oui, ils ont dû tricher avec la spec HTML5 pour lkes plugins flash/silverlight
				_mejs.setCurrentTime(0);
			});
			$('.video-reward').click(function(){
				//_mejs.currentTime -= 10;
				_mejs.setCurrentTime(_mejs.media.currentTime<10?0:(_mejs.media.currentTime-10));
			});
			$('.video-play').click(function(){
				_mejs.pause();
				$('.video-play').hide();
				$('.video-pause').show();
			});
			$('.video-pause').hide().click(function(){
				_mejs.play();
				$('.video-play').show();
				$('.video-pause').hide();
			});
			$('.video-stop').hide().click(function(){
				_mejs.setCurrentTime(0);
				_mejs.play();
				$('.video-play').show();
				$('.video-stop').hide();
			});
			$('.video-foward').click(function(){
				_mejs.setCurrentTime(_mejs.media.currentTime+10);
			});
			$('.video-next').click(function(){
				_mejs.setCurrentTime(_mejs.media.currentTime+60);
			});
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
