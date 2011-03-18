(function(J, $, _) {


    /**
     * @class MediaElementJs video backend
     * @augments J.UI.VideoBase
     */
    J.UI.VideoYouTube = J.Class(J.UI.VideoMediaElement,
    /** @lends J.UI.VideoMediaElement.prototype */
    {

        init:function() {
            this.embedId = this.htmlId+"_ytembed";
            this.__base();
        },

        playWithStaticUrl: function(options) {
            this.playData = options;

            var self=this;
            window.onYouTubePlayerReady = function(playerId) {
                
                console.log("ytPlayerReady", playerId);
                
                self.player = document.getElementById(self.embedId);

                var me = self.player;
                var that = self;
                
                self.startListening(self.player, 'onStateChange',function(newState) {
                    console.log("youtube state",newState);
                    
                    var that = self;
                    
                    if (newState==-1) { //unstarted (=swf loaded)
                        
                        that.publish('success');
                        
                    } else if (newState==0) { //ended
                        
                        that.setVideoStatus("stopped");
                        that.publish('ended');
                        that.playNext();
                        
                    } else if (newState==1) { //playing
                        
                        that.setVideoStatus("playing");
                        
                    } else if (newState==2) { //paused
                        
                        that.setVideoStatus("paused");
                        
                    } else if (newState==3) { //buffering
                        
                        /*
                            that.videoDuration = me.duration;
                            that.publish('progress',[{"totalTime":me.duration,"bufferedBytes":me.bufferedBytes,"totalBytes":me.bytesTotal}]);
                        */
                        
                    } else if (newState==5) { //cued
                        /*
                        ?
                        */
                    }
                    
                });
                
                self.startListening(self.player, 'onError',function(errorCode) {
                    
                    self.setVideoStatus("stopped");
                    
                    //TODO better error code mapping
                    if (errorCode==2) {
                        self.errorCode = 9; //unsupported
                        self.error();
                    } else if (errorCode==100) {
                        self.errorCode = 4;
                        self.error();
                    } else if (errorCode==101 || errorCode==150) {
                        self.errorCode = 3;
                        self.error();
                    }
                    
                });
                
                /*todo settimeout
                    that.startListening(me, 'timeupdate', function(ev) {
                        that.videoDuration = me.duration;
                        that.publish('timeupdate',[{"currentTime":me.currentTime,"totalTime":me.duration,"bufferedBytes":me.bufferedBytes,"totalBytes":me.bytesTotal}]);
                    });
                */
                
                //self.startListening(self.player, 'onPlaybackQualityChange',function(newState) {
                
                self.player.loadVideoById(self.playData.url,0,self.playData.videoQuality || "default");
                
            };
            
            this.stopListeningAll(this.player);
            
            $("#" + this.htmlId)[0].innerHTML = 'Loading...';
            
            var params = { allowScriptAccess: "always", wmode:"opaque" };
            var atts = { id: this.embedId };
            swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", //"http://www.youtube.com/e/"+this.playData.url+"?enablejsapi=1&version=3&playerapiid=ytplayer"
                                  this.htmlId, "100%", "100%", "8", null, null, params, atts);
            
            this.setVideoStatus("loading");

        },

        getCurrentTime:function() {
            if (this.player) return this.player.getCurrentTime();
            return 0;
        },
        
        setCurrentTime:function(seconds) {
            if (this.player) this.player.seekTo(seconds);
        },
        
        pause: function() {
            this.setVideoStatus("paused");
            if (this.player) this.player.pauseVideo();
        },

        stop: function() {
            this.setVideoStatus("stopped");
            if (this.player) this.player.stopVideo();
        },

        resume: function() {
            this.setVideoStatus("playing");
            if (this.player) this.player.play();
        },

        remove: function()
        {
            this.playingPath = false;
            //if (typeof this.player != 'undefined')
            if (this.player)
            {
                try
                {
                    console.log("remove workflow: stopAll", this.id);
                    this.stopListeningAll(this.player);
                } catch(e) {}

                try
                {
                    
                    this.player.stopVideo();

                } catch(e) {}

                try
                {
                    console.log("remove workflow: remove", this.id);
                    $("ytapiplayer").remove();
                } catch(e) {}

                try
                {
                    console.log("remove workflow: delete", this.id);
                    delete this.player;
                } catch(e) {}


            }
            console.log("REMOVED VIDEO", this.id);
            //$("#"+this.htmlId).html('');
        }
        
    });

})(Joshlib, jQuery, _);