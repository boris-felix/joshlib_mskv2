(function(J,$) {

	
	J.UI.Video = J.Class(J.UI.Video,{
		
		init:function() {
		    this.message=''; // pour la gerstion des messages d'erreurs, versions linguistiques
    		this.errorCode=0; // pour la gerstion des messages d'erreurs, versions linguistiques
    		
    		this.listeners = {};
    		
    		//Should have an HTML5 <video>-like API
    		this.player = false;
    		
    		var self=this;
     		this.grid = new J.Grid({
    		    "grid":[
    		        [{"id":"previous"}        ,{"id":"reward"}         ,{"id":"p"}     ,{"id":"foward"}         ,{"id":"next"}]
    		    ],
    		    "dimensions":2,
                "onChange":function(coords,elem) {
                  $("div.video-controls .focused").removeClass("focused");
                  
                  if (elem.id=="p") {
                      $(".video-play, .video-pause, .video-stop").addClass("focused");
                  } else {
                      $(".video-"+elem.id).addClass("focused");
                  }
                },
                "onExit":function(side) {
                    if (side=="down") {
                        self.app.publish("menuGo",["focus","up"]);
                    }
                },
                "orientation":"up"
    		});
    		
    		this.videoStatus = false;
    		
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
		
		show:function() {
		    this.__base();
		    $("#"+this.htmlId+" .video-controls").stop().css({"opacity":1}).show();
		},
		hide:function() {
		    this.__base();
		    $("#"+this.htmlId+" .video-controls").hide();
		},
		
		refresh:function() {
		    
		},
		
		onFocus:function() {

		    var hadFocus = this.hasFocus;
		    this.__base();
		    var self = this;
		    if (!hadFocus) {
		        setTimeout(function() {self.grid.goTo([2,0]);},50);
		    }
		},
		
		subscribes:function() {

		    var self=this;
		    return this.__base().concat([
		        ["control",function(ev,data) {
		            
		            var sens = data[0];
		            
		            console.log("receiveControl",self.id,data);
		            
		            if (sens=="left" || sens=="right" || sens=="down" || sens=="up") {
		                self.grid.go(sens);
		                
		            } else if (sens=="hover") {
		                var position = [parseInt(data[1].match(/\_([^\_]+)$/)[1].split(".")[0]),0];
		                console.log("p hover",position);
		                self.grid.goTo(position);
		                
		            } else if (sens=="enter") {
		                
		                var position = self.grid.currentCoords;
		                if (data[1]) {
		                    position = [parseInt(data[1].match(/\_([^\_]+)$/)[1].split(".")[0]),0];
		                }
		                console.log("p enter",position,self.videoStatus);
		                if (position[0]==0) { //previous
		                    self.player.setCurrentTime(0);
		                    
		                } else if (position[0]==1) { //reward
		                    self.player.setCurrentTime(self.player.currentTime<10?0:(self.player.currentTime-10));
		                
		                } else if (position[0]==2) { //play pause stop
		                    
		                    if (self.videoStatus=="playing") {
		                        self.setVideoStatus("paused");
		                        self.player.pause();
		                        
		                        
		                    } else if (self.videoStatus=="stopped" || self.videoStatus=="paused") {
		                        self.setVideoStatus("playing");
		                        self.player.play();
                                
                                
                            }
                            
		                } else if (position[0]==3) { //foward
		                    self.player.setCurrentTime(self.player.currentTime+10);
		                } else if (position[0]==4) { //next
		                    self.player.setCurrentTime(self.player.currentTime+60);
		                }
		                
		            }
		        }]
		    ]);
		    
		},
		
		setVideoStatus:function(status) {
		    this.videoStatus = status;
		    
		    if (status=="playing") {
		        $('.video-stop , .video-play').hide();
				$('.video-pause').show();
		    } else if (status=="paused" || status=="stopped") {
		        $('.video-stop , .video-pause').hide();
    			$('.video-play').show();
		    }
		    
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
			
			if (this.options["forceAspectRatio"]) {
			    if (!this.options['width']) {
			        $('#'+this.htmlId+'_video').css({'width':(this.options["forceAspectRatio"]*$('#'+this.htmlId+'_video').height())+"px"});
			    }
			}
            
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
					me.addEventListener('playing',function(ev){
					    that.setVideoStatus("playing");
					});
					me.addEventListener('timeupdate',function(ev){
					    //that.setVideoStatus("playing");
						$('.video-currenttime').text(mejs.Utility.secondsToTimeCode(me.currentTime));
						$('.video-time-current').css('width',Math.round(100 * me.currentTime / me.duration)+'%');
						$('.video-time-loaded').css('width',Math.round(100 * me.bufferedBytes / me.bytesTotal)+'%');
						that.delegated('timeupdate');
					});
					me.addEventListener('ended',function(ev){
					    that.setVideoStatus("stopped");
						$('.video-play , .video-pause').hide();
						$('.video-stop').show();
						that.delegated('ended');
					});
					
					me.addEventListener('canplay',function(ev){
						me.play();
						that.setVideoStatus("playing");
						$('.video-buttons').show();
						$('.video-info').hide();
						that.delegated('canplay');
					});
					
					me.addEventListener('error',function(ev){
					    //ignore errors about the gif img unloader
					    if (ev.target.src.match(/^data\:/)) {
					        return;
					    }
					    console.log("ERRVIDEO",ev);
					    that.setVideoStatus("stopped");
					        
						that.handleError(ev);
					});
					
				}
            });
            
			$('.video-controls').remove();
			
			var buttonsHtml = (typeof this.options['buttonsHtml'] !== 'undefined') ? this.options['buttonsHtml'] : 
								'<span id="'+this.htmlId+'_button_0" class="video-button video-previous joshover">▐◀</span>\
								<span id="'+this.htmlId+'_button_1" class="video-button video-reward joshover">◀◀ </span>\
								<span id="'+this.htmlId+'_button_2.0" class="video-button video-play joshover">▶</span>\
								<span id="'+this.htmlId+'_button_2.1" class="video-button video-pause joshover">▮▮</span>\
								<span id="'+this.htmlId+'_button_2.2" class="video-button video-stop joshover">■</span>\
								<span id="'+this.htmlId+'_button_3" class="video-button video-foward joshover">▶▶</span>\
								<span id="'+this.htmlId+'_button_4" class="video-button video-next joshover">▶▌</span>';
			
			$('<div class="video-controls">\
					<div class="video-info">'+((typeof this.options['pleaseWait'] !== 'undefined')?this.options['pleaseWait']:'Please wait&nbsp;⋅⋅⋅')+'</div>\
					<div class="video-buttons">'+buttonsHtml+
						'<span class="video-time"><span class="video-currenttime">00:00</span> / <span class="video-duration">00:00</span></span>\
					</div>\
					<div class="video-time-rail"><span class="video-time-total"><span class="video-time-loaded"></span><span class="video-time-current"></span></span></div>\
				</div>').appendTo("#"+this.htmlId);
				
			if (options["url"]===undefined)
			{
				this.errorCode=-1;
				this.handleError('undefined');
			}
			
			this.setVideoStatus("loading");
				
			$('.video-buttons, .video-pause, .video-stop').hide();
			
			//Only mouse for now
			$('.video-time-rail').click(function(e){
				var t=$('.video-time-rail');
				if (that.player) that.player.setCurrentTime(Math.floor(that.player.duration*(e.pageX-t.offset().left)/t.width()));
			});
			
		},
		
		onBlur:function() {
		    this.__base();
		    
		    $(".video-controls").hide();
		    
		},
		
		pause:function() {
		    if (this.player) this.player.pause();
	    },
		
		remove:function()
		{
		    this.playingPath=false;
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
				    this.setVideoStatus("stopped");
				} catch (e) {}
				
                try 
				{
					this.player.setSrc('data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAP///wAAACH/C0FET0JFOklSMS4wAt7tACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
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
			console.log("REMOVED VIDEO",this.id);
			//$("#"+this.htmlId).html('');
		},
	    
	    getHtml:function()
		{
			return "<div id='"+this.htmlId+"'></div>"; 
		}
		
	});
	
	
})(Joshlib,jQuery);
