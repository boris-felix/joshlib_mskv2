(function(J, $) {


    /**
     * @class MediaElementJs video backend
     * @augments J.UI.VideoBase
     */
    J.UI.VideoYouTube = J.Class(J.UI.VideoBase,
    /** @lends J.UI.VideoMediaElement.prototype */
    {

        init: function() {
            this.message = '';
            // pour la gerstion des messages d'erreurs, versions linguistiques
            this.errorCode = 0;
            // pour la gerstion des messages d'erreurs, versions linguistiques
            this.listeners = {};

            //Should have an HTML5 <video>-like API
            this.player = false;

            var self = this;
            this.grid = new J.Utils.Grid({
                "grid": [
                [{
                    "id": "previous"
                },
                {
                    "id": "reward"
                },
                {
                    "id": "p"
                },
                {
                    "id": "foward"
                },
                {
                    "id": "next"
                }]
                ],
                "dimensions": 2,
                "onSelect": function(coords, elem) {
                    $("div.video-controls .focused").removeClass("focused");

                    if (elem.id == "p") {
                        $(".video-play, .video-pause, .video-stop").addClass("focused");
                    } else {
                        $(".video-" + elem.id).addClass("focused");
                    }
                },
                "onExit": function(side) {
                    console.log("exxxxit", side);
                    if (side[1] < 0) {
                        self.app.publish("stateGo", ["focus", "up"]);
                    }
                },
                "orientation": self.options.orientation || "up"
            });

            this.videoStatus = false;

            $(window).bind('unload',function() {
                try {
                    self.remove();
                } catch (e) {}
            });

            this.app.subscribe("input",
            function(ev, data) {

                if (self.isDefaultPlayer) {
                    if (data[0] == "play") {

                        self.grid.goTo([2, 0]);
                        self.app.publish("stateGoTo", ["focus", self.treeRoot], true);
                        self.app.publish("input", ["enter"], true);
                    } else if (data[0] == "stop") {
                        self.app.publish("stateGoTo", ["focus", self.treeRoot], true);
                        self.stop();
                    } else if (data[0] == "pause") {
                        self.app.publish("stateGoTo", ["focus", self.treeRoot], true);
                        self.pause();
                    } else if (data[0] == "forward") {
                        self.app.publish("stateGoTo", ["focus", self.treeRoot], true);
                        self.grid.goTo([3, 0]);
                        self.app.publish("input", ["enter"], true);
                    } else if (data[0] == "rewind") {
                        self.app.publish("stateGoTo", ["focus", self.treeRoot], true);
                        self.grid.goTo([1, 0]);
                        self.app.publish("input", ["enter"], true);
                    }
                }


            });

            this.__base();

        },

        delegated: function(
        /* eventName, [eventArguments] */
        ) {
            var eventName = Array.prototype.slice.call(arguments);

            if (typeof this.options[eventName] == 'function')
            {
                return this.options[eventName].apply(this, arguments);
            }
        },
        handleError: function(ev)
        {
            $('.video-buttons').hide();
            $('.video-info').show();
            this.errorCode = this.errorCode != 0 ? this.errorCode: ev.srcElement.error.code;


            switch (this.errorCode)
            {
            case 1:
                //MEDIA_ERR_ABORTED
                this.message = '<span>' + (this.options.errorMessages["aborted"] || "The loading of the video was aborted") + "</span>";
                break;
            case 2:
                //MEDIA_ERR_NETWORK:
                this.message = '<span>' + (this.options.errorMessages["network"] || "A network problem is preventing the video from loading") + "</span>";

                break;
            case 3:
                //MEDIA_ERR_DECODE
                this.message = '<span>' + (this.options.errorMessages["decode"] || "The video format is not recognized") + "</span>";
                break;
            case 4:
                //MEDIA_ERR_SRC_NOT_SUPPORTED
                //TODO check this error message
                this.message = '<span>' + (this.options.errorMessages["notsupported"] || "The video couldn't be loaded because of a server issue") + "</span>";
                break;
            default:
                this.message = '<span>' + (this.options.errorMessages["other"] || "Unknown error") + "</span>";
                break;
            }

            console.error('handleError', this.errorCode, this.message);

            this.delegated('error');
            $('.video-info').html(this.message);
        },

        startListening: function(target, eventName, listener) {
            this.listeners[eventName] = listener;
            window.Joshlib_Youtube_Listeners = this.listeners;
            target.addEventListener(eventName, "Joshlib_Youtube_Listeners."+eventName);
        },

        stopListeningAll: function(target) {

            $.each(this.listeners,
            function(i, o) {
                try {
                    target.removeEventListener(i, o);
                } catch(e) {}
            });
        },

        show: function() {
            this.__base();
            $("#" + this.htmlId + " .video-controls").stop().css({
                "opacity": 1
            }).show();
        },
        hide: function() {
            this.__base();
            $("#" + this.htmlId + " .video-controls").hide();
        },

        refresh: function() {

            },

        onFocus: function() {

            var hadFocus = this.hasFocus;
            this.__base();
            var self = this;
            if (!hadFocus) {
                setTimeout(function() {
                    self.grid.goTo([2, 0]);
                },
                50);
            }
        },

        subscribes: function() {

            var self = this;
            return this.__base().concat([
            ["input",
            function(ev, data) {

                var sens = data[0];

                console.log("receiveInput", self.id, data);

                if (sens == "left" || sens == "right" || sens == "down" || sens == "up") {
                    self.grid.go(sens);

                } else if (sens == "hover") {
                    var m = data[1].match(/\_([^\_]+)$/);
                    if (m) {
                        var position = [parseInt(m[1].split(".")[0]), 0];
                        console.log("p hover", position);
                        self.grid.goTo(position);
                    }


                } else if (sens == "enter") {

                    var position = self.grid.currentCoords;
                    if (data[1]) {

                        var m = data[1].match(/\_([^\_]+)$/);

                        //event is not for us
                        if (!m) {
                            return;
                        }

                        position = [parseInt(m[1].split(".")[0]), 0];
                    }
                    console.log("p enter", position, self.videoStatus);
                    if (position[0] == 0) {
                        //previous
                        self.player.setCurrentTime(0);

                    } else if (position[0] == 1) {
                        //reward
                        self.player.setCurrentTime(self.player.currentTime < 10 ? 0: (self.player.currentTime - 10));

                    } else if (position[0] == 2) {
                        //play pause stop
                        if (self.videoStatus == "playing") {
                            self.pause();


                        } else if (self.videoStatus == "stopped" || self.videoStatus == "paused") {
                            self.setVideoStatus("playing");
                            self.resume();


                        }

                    } else if (position[0] == 3) {
                        //foward
                        self.player.setCurrentTime(self.player.currentTime + 10);
                    } else if (position[0] == 4) {
                        //next
                        self.player.setCurrentTime(self.player.currentTime + 60);
                    }

                }
                
            }]
            ]);

        },

        setVideoStatus: function(status) {
            this.videoStatus = status;

            if (status == "playing") {
                $('.video-stop , .video-play').hide();
                $('.video-pause').show();
            } else if (status == "paused" || status == "stopped") {
                $('.video-stop , .video-pause').hide();
                $('.video-play').show();
            }

        },
        
        resume:function() {
            this.player.playVideo();
        },

        play: function(options)
        {
            var self = this;
            if (typeof options.url == "function") {
                options.url(function(error, url) {
                    if (error) {
                        this.errorCode = 4;
                        return self.handleError();
                    }
                    options.url = url;
                    self._play(options);
                })
            } else {
                return self._play(options);
            }
        },

        _play: function(options) {
            this.playData = options;

            console.log("playData", options);


            var self=this;
            window.onYouTubePlayerReady = function(playerId) {
                console.log("ytPlayerReady", playerId);
                self.player = document.getElementById("myytplayer");

                var me = self.player;
                
                /*
                self.startListening(me, 'progress',
                function(ev) {
                    $('.video-duration').text(isNaN(me.duration) ? '--:--': mejs.Utility.secondsToTimeCode(me.duration));
                    $('.video-time-loaded').css('width', Math.round(100 * me.bufferedBytes / me.bytesTotal) + '%');
                    that.delegated('progress');
                });
                */
                
                self.startListening(self.player, 'onStateChange',function(newState) {
                    console.log("youtube state",newState);
                    var that = self;
                    
                    if (newState==-1) { //unstarted (=swf loaded)
                        
                        $('.video-buttons').show();
                        $('.video-info').hide();
                        
                        that.delegated('success');
                        
                    } else if (newState==0) { //ended
                        
                        
                        that.setVideoStatus("stopped");
                        $('.video-play , .video-pause').hide();
                        $('.video-stop').show();

                        that.delegated('ended');

                        that.playNext();
                        
                    } else if (newState==1) { //playing
                        
                        that.setVideoStatus("playing");
                        that.delegated('playing');
                        
                    } else if (newState==2) { //paused
                        
                    } else if (newState==3) { //buffering
                        
                        /*
                        me.play();
                        $('.video-buttons').show();
                        $('.video-info').hide();
                        that.delegated('canplay');
                        */
                        
                    } else if (newState==5) { //cued
                        
                    }
                    
                });
                
                self.startListening(self.player, 'onError',function(errorCode) {
                    
                    self.setVideoStatus("stopped");
                    
                    //TODO better error code mapping
                    if (errorCode==2) {
                        self.errorCode = 9; //unsupported
                        self.handleError();
                    } else if (errorCode==100) {
                        self.errorCode = 4;
                        self.handleError();
                    } else if (errorCode==101 || errorCode==150) {
                        self.errorCode = 3;
                        self.handleError();
                    }
                    
                });
                
                
                /* todo timer
                
                that.startListening(me, 'timeupdate',
                function(ev) {
                    //that.setVideoStatus("playing");
                    $('.video-currenttime').text(mejs.Utility.secondsToTimeCode(me.currentTime));
                    $('.video-time-current').css('width', Math.round(100 * me.currentTime / me.duration) + '%');
                    $('.video-time-loaded').css('width', Math.round(100 * me.bufferedBytes / me.bytesTotal) + '%');
                    that.delegated('timeupdate');
                });
                */
                
                //self.startListening(self.player, 'onPlaybackQualityChange',function(newState) {
                
                //self.player.loadVideoById(self.playData.url,0,"hd720");
                
                self.player.loadVideoById(self.playData.url,0,"hd1080");
                
                //self.player.loadVideoById(self.playData.url,0,"default");
            };
            
            this.stopListeningAll(this.player);
            
            $("#" + this.htmlId)[0].innerHTML = '<div id="ytapiplayer">Loading...</div>';
            
            var params = { allowScriptAccess: "always" };
            var atts = { id: "myytplayer" };
            swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", //"http://www.youtube.com/e/"+this.playData.url+"?enablejsapi=1&version=3&playerapiid=ytplayer"
                                  "ytapiplayer", "100%", "100%", "8", null, null, params, atts);
            
            
            $('.video-controls').remove();

            var buttonsHtml = (typeof this.options['buttonsHtml'] !== 'undefined') ? this.options['buttonsHtml'] :
            '<span id="' + this.htmlId + '_button_0" class="video-button video-previous joshover">▐◀</span>\
								<span id="' + this.htmlId + '_button_1" class="video-button video-reward joshover">◀◀ </span>\
								<span id="' + this.htmlId + '_button_2.0" class="video-button video-play joshover">▶</span>\
								<span id="' + this.htmlId + '_button_2.1" class="video-button video-pause joshover">▮▮</span>\
								<span id="' + this.htmlId + '_button_2.2" class="video-button video-stop joshover">■</span>\
								<span id="' + this.htmlId + '_button_3" class="video-button video-foward joshover">▶▶</span>\
								<span id="' + this.htmlId + '_button_4" class="video-button video-next joshover">▶▌</span>';

            $('<div class="video-controls">\
					<div class="video-info">' + ((typeof this.options['pleaseWait'] !== 'undefined') ? this.options['pleaseWait'] : 'Please wait&nbsp;⋅⋅⋅') + '</div>\
					<div class="video-buttons">' + buttonsHtml +
            '<span class="video-time"><span class="video-currenttime">00:00</span> / <span class="video-duration">00:00</span></span>\
					</div>\
					<div class="video-time-rail"><span class="video-time-total"><span class="video-time-loaded"></span><span class="video-time-current"></span></span></div>\
				</div>').appendTo("#" + this.htmlId);

            this.setVideoStatus("loading");

            $('.video-buttons, .video-pause, .video-stop').hide();

            //Only mouse for now
            $('.video-time-rail').click(function(e) {
                var t = $('.video-time-rail');
                if (that.player) that.player.setCurrentTime(Math.floor(that.player.duration * (e.pageX - t.offset().left) / t.width()));
            });
            
            

        },

        onBlur: function() {
            this.__base();

            $(".video-controls").hide();

        },

        playNext: function() {
            var that = this;

            var playlistNextMoves = that.app.tree.getData(that.treeCurrent).playlistNext || ["next"];
            console.log("playlistNextMoves", that.treeCurrent, that.app.tree.getData(that.treeCurrent).playlistNext, JSON.stringify(playlistNextMoves));
            that.app.tree.resolveMoves(that.treeCurrent, playlistNextMoves,
            function(newPath) {
                that.app.publish("stateGoTo", ["focus", newPath], true);
                that.app.publish("input", ["enter"]);
            });
        },

        pause: function() {
            this.setVideoStatus("paused");
            if (this.player) this.player.pauseVideo();
        },

        stop: function() {
            this.setVideoStatus("stopped");
            if (this.player) this.player.stopVideo();
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
        },

        getHtml: function()
        {
            return "<div id='" + this.htmlId + "'></div>";
        }

    });


})(Joshlib, jQuery);
