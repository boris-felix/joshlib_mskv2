(function(J,$) {

	/// TODO implémenter les gestions d'erreurs dans la box de controle
	
	// plus d'infos sur les events de la balise video : http://www.w3.org/2010/05/video/mediaevents.html
	/*
	$('video').live('onerror error',function(e){
		$('#infobulle').stop().css(infobulleAspectLevel2);
		// d'après http://www.w3.org/TR/html5/video.html
			delayHidingPanel(false);
			switch (e.target.error.code)
			{
				case e.target.error.MEDIA_ERR_ABORTED:
					showbartitle('Lecture interrompue','Vous avez annulé la lecture de la vidéo.');
				break;
				case e.target.error.MEDIA_ERR_NETWORK:
					showbartitle('Lecture interrompue','Un incident réseau a interrompu le flux vidéo.');
				break;
				case e.target.error.MEDIA_ERR_DECODE:
					showbartitle('Lecture impossible','La lecture vidéo s’est interrompue soit parce que le document a été corrompu ou parce que la vidéo utilise des fonctionnalités trop avancées.');
				break;
				case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
					showbartitle('Lecture impossible','Cette vidéo n’a pu être chargée, soit à cause d’un problème sur notre serveur, sur internet ou que le format vidéo n’est pas reconnu.');
				break;
				default:
					showbartitle('Lecture interrompue','Une erreur non répertoriée a eu lieue.');
				break;
			}
	});
	
	$('video').live('play canplay buffer buffered',function(){
		$('#infobulle , ul').stop().fadeOut();
		$('.flareVideo > .controls').show();
	});
	
	$('video').live('ended',function(){
		delayHidingPanel(false);
	});
	// #france24_e_List_showbar img , 
	*/
	
	J.UI.Video = J.Class(J.UI.Video,{
		
		init:function() {
		    this.message=''; // pour la gerstion des messages d'erreurs, versions linguistiques
    		this.errorCode=0; // pour la gerstion des messages d'erreurs, versions linguistiques
    		
    		this.listeners = {};
    		
    		//Should have an HTML5 <video>-like API
    		this.player = false;
    		
    		this.__base();
		},
		
		delegated : function( /* eventName, [eventArguments] */ ) {
		    var eventName = Array.prototype.slice.call(arguments);
		    
			if (typeof this.options[eventName]=='function')
			{
				return this.options[eventName].apply(this,arguments);
			}
		},
		handleError : function(ev)
		{
			$('.video-buttons').hide();
			$('.video-info').show();
			this.errorCode=this.errorCode!=0?this.errorCode:ev.srcElement.error.code;
			switch (this.errorCode)
			{
				case ev.target.error.MEDIA_ERR_ABORTED:
					this.message='Vous avez annulé la lecture de la vidéo.';
				break;
				case ev.target.error.MEDIA_ERR_NETWORK:
					this.message='Un incident réseau a interrompu la vidéo.';
				break;
				case ev.target.error.MEDIA_ERR_DECODE:
					this.message='La vidéo est corrompue ou non-reconnue.';
				break;
				case ev.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
					this.message='La vidéo n’a pu être chargée à cause d’un problème serveur.';
				break;
				default:
					this.message='Une erreur a eu lieue.';
				break;
			}
console.error('handleError',this.errorCode,this.message);
			this.delegated('error'); // oui, l'évènement a lieu AVANT pour que vous puissiez le gérer à votre aise
			$('.video-info').html(this.message);
		},
		
		startListening:function(target,eventName,listener) {
		    this.listeners[eventName] = listener;
		    target.addEventListener(eventName,listener);
		},
		
		stopListeningAll:function(target) {
		    $.each(this.listeners,function(i,o) {
		        target.removeEventListener(i,o);
		    });
		},
		
		play:function(options)
		{

            if (this.player) {
                this.remove();
            }
            
            window._vid = this;
			
            if (options["url"].match(/\.flv$/) || options["mime"]=="video/flv")
			{
                // No autoplay here because <video src='xxx.flv' autoplay> will start playing on a GoogleTV
        		// even if video.canPlayType("video/flv")==""        		
                $("#"+this.htmlId)[0].innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' poster='"+options["image"]+"' />";
            } else {
                $("#"+this.htmlId)[0].innerHTML = "<video id='"+this.htmlId+"_video' src='"+options["url"]+"' autoplay='true' autobuffer preload poster='"+options["image"]+"' />";
            }
			
			$('#'+this.htmlId+'_video').css({
				'width'		: (typeof this.options['width'] !== 'undefined') ? this.options['width'] : '100%',
				'height'	: (typeof this.options['height'] !== 'undefined') ? this.options['height'] : '100%',
				'z-index'   : 00
			});
            
console.info('play',options["url"])
			
			var that=this;
			
			//Pull this in MediaElement later
			mejs.HtmlMediaElementShim.myCreate = function(el, o) {			
        		var
        			options = mejs.MediaElementDefaults,
        			htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,					
        			isVideo = (htmlMediaElement.tagName.toLowerCase() == 'video'),			
        			supportsMediaTag = (typeof(htmlMediaElement.canPlayType) != 'undefined'),
        			playback = {method:'', url:''},
        			poster = htmlMediaElement.getAttribute('poster'),
        			autoplay =  htmlMediaElement.getAttribute('autoplay'),
        			preload =  htmlMediaElement.getAttribute('preload'),
        			prop;

        		// extend options
        		for (prop in o) {
        			options[prop] = o[prop];
        		}

        		// check for real poster
        		poster = (typeof poster == 'undefined' || poster === null) ? '' : poster;
        		preload = true;
        		autoplay = true;

        		// test for HTML5 and plugin capabilities
        		playback = this.determinePlayback(htmlMediaElement, options, isVideo, supportsMediaTag);

        		if (playback.method == 'native') {
        			// add methods to native HTMLMediaElement
        			this.updateNative( htmlMediaElement, options, autoplay, preload, playback);				
        		} else if (playback.method !== '') {
        			// create plugin to mimic HTMLMediaElement
        			this.createPlugin( htmlMediaElement, options, isVideo, playback.method, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url).replace('&','%26') : '', poster, autoplay, preload);
        		} else {
        			// boo, no HTML5, no Flash, no Silverlight.
        			this.createErrorMessage( htmlMediaElement, options, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '', poster );
        		}			
        	};
			
			
            mejs.HtmlMediaElementShim.myCreate($('#'+this.htmlId+"_video")[0],{
                pluginPath:"/swf/",
                videoWidth: $('#'+this.htmlId+"_video").width(),
                videoHeight: $('#'+this.htmlId+"_video").height(),
                pluginWidth: $('#'+this.htmlId+"_video").width(),
                pluginHeight: $('#'+this.htmlId+"_video").height(),
                
                //type:"native",
                //enablePluginDebug:true,
				error:this.handleError,
                success:function(me,domNode) {
                    
                    that.player = me;
                    window._mejs=me;
                    
					$('.video-buttons').show();
					$('.video-info').hide();
                    
					that.delegated('success');
					me.addEventListener('progress',function(ev){
						$('.video-duration').text(isNaN(me.duration)?'--:--':   mejs.Utility.secondsToTimeCode(me.duration));
						$('.video-time-loaded').css('width',Math.round(100 * me.bufferedBytes / me.bytesTotal)+'%');
						that.delegated('progress');
					});
					me.addEventListener('timeupdate',function(ev){
						$('.video-currenttime').text(mejs.Utility.secondsToTimeCode(me.currentTime));
						$('.video-time-current').css('width',Math.round(100 * me.currentTime / me.duration)+'%');
						$('.video-time-loaded').css('width',Math.round(100 * me.bufferedBytes / me.bytesTotal)+'%');
						that.delegated('timeupdate');
					});
					me.addEventListener('ended',function(ev){
						$('.video-play , .video-pause').hide();
						$('.video-stop').show();
						that.delegated('ended');
					});
					
					me.addEventListener('canplay',function(ev){
						me.play();
						$('.video-buttons').show();
						$('.video-info').hide();
						that.delegated('canplay');
					});
					
					me.addEventListener('error',function(ev){
					    console.log(ev);    
						that.handleError(ev);
					});
					
				}
            });
            
			$('.video-controls').remove();
			
			var buttonsHtml = (typeof this.options['buttonsHtml'] !== 'undefined') ? this.options['buttonsHtml'] : 
								'<span class="video-button video-previous">▐◀</span>\
								<span class="video-button video-reward">◀◀ </span>\
								<span class="video-button video-play">▶</span>\
								<span class="video-button video-pause">▮▮</span>\
								<span class="video-button video-stop">■</span>\
								<span class="video-button video-foward">▶▶</span>\
								<span class="video-button video-next">▶▌</span>';
			
			$('<div class="video-controls">\
					<div class="video-info">'+((typeof this.options['pleaseWait'] !== 'undefined')?this.options['pleaseWait']:'Please wait&nbsp;⋅⋅⋅')+'</div>\
					<div class="video-buttons">'+buttonsHtml+
						'<span class="video-time"><span class="video-currenttime">00:00</span> / <span class="video-duration">00:00</span></span>\
					</div>\
					<div class="video-time-rail"><span class="video-time-total"><span class="video-time-loaded"></span><span class="video-time-current"></span></span></div>\
				</div>').appendTo('#main');
				
			if (options["url"]===undefined)
			{
				this.errorCode=-1;
				this.handleError('undefined');
			}
				
			$('.video-buttons').hide();
			
			$('.video-previous').click(function(){
				if (that.player) that.player.setCurrentTime(0);
			});
			$('.video-reward').click(function(){
				if (that.player) that.player.setCurrentTime(that.player.currentTime<10?0:(that.player.currentTime-10));
			});
			$('.video-pause').click(function(){
				if (that.player) that.player.pause();
				$('.video-play').show();
				$('.video-pause').hide();
			});
			$('.video-play').hide().click(function(){
				if (that.player) that.player.play();
				$('.video-play').hide();
				$('.video-pause').show();
			});
			$('.video-stop').hide().click(function(){
				if (that.player) {
				    that.player.setCurrentTime(0);
				    that.player.play();
				}
				$('.video-stop , .video-play').hide();
				$('.video-pause').show();
			});
			$('.video-foward').click(function(){
				if (that.player) that.player.setCurrentTime(that.player.currentTime+10);
			});
			$('.video-next').click(function(){
				if (that.player)that.player.setCurrentTime(that.player.currentTime+60);
			});
			$('.video-time-rail').click(function(e){
				var t=$('.video-time-rail');
				if (that.player) that.player.setCurrentTime(Math.floor(that.player.duration*(e.pageX-t.offset().left)/t.width()));
			});
			
		},
		
		pause:function() {
		    if (this.player) this.player.pause();
	    },
		
		remove:function()
		{
			if (typeof this.player != 'undefined')
			{
			    try 
				{
					this.stopListeningAll(this.player);
				} catch (e) {}
                
				try 
				{
					this.player.pause();
				} catch (e) {}
				
				try 
				{
					this.player.stop();
				} catch (e) {}
				
                try 
				{
					this.player.setSrc('http://imgjam.com/spacer.gif');
					this.player.load();
				} catch (e) {}
				
				try 
				{
					this.player.stop();
				} catch (e) {}
                
				try 
				{
					$(this.player).remove();
				} catch (e) {}
				
				try 
				{
					delete this.player;
				} catch (e) {}
                
				
			}
			$("#"+this.htmlId).html('');
		},
	    
	    getHtml:function()
		{
			// BUG style='display:none;'  typiquement ce qui est royalement pénible : les styles embarqués. Je pense qu'il vaut mieux insérer le html, et ensuite utiliser hide()
			// ça m'a quand même foutu en l'air une journée ces bétises.
			return "<div id='"+this.htmlId+"'></div>"; 
		}
		
	});
	
	
})(Joshlib,jQuery);
