(function(J, $) {

    /**
     * @class MediaElementJs video backend
     * @augments J.UI.VideoBase
     */
    J.UI.VideoMediaElement = J.Class(J.UI.VideoBase,
    /** @lends J.UI.VideoMediaElement.prototype */
    {

        init: function() {
            
            // Event listeners
            this.listeners = {};

            // Should have an HTML5 <video>-like API
            this.player = false;

            // Status of the video
            this.videoStatus = false;

            // Memory leak fixes
            $(window).bind('unload',function() {
                try {
                    self.remove();
                } catch (e) {}
            });

            this.app.subscribe("input",function(ev, data) {
                if (self.isDefaultPlayer) {
                    self.handleInputEvent(data);
                }
            });
            this.subscribe("input",function(ev,data) {
                self.handleInputEvent(data);
            });

            this.__base();

        },
        
        handleInputEvent:function(data) {
            if (data[0] == "play") {
                self.resume();
            } else if (data[0] == "stop") {
                self.stop();
            } else if (data[0] == "pause") {
                self.pause();
            } else if (data[0] == "forward") {
                self.playNext();
            } else if (data[0] == "rewind") {
                self.playPrev();
            }
        },

        error: function(ev)
        {

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

            this.publish('error',[this.errorCode, this.message]);
            
        },

        startListening: function(target, eventName, listener) {
            this.listeners[eventName] = listener;
            target.addEventListener(eventName, listener);
        },

        stopListeningAll: function(target) {

            $.each(this.listeners,
            function(i, o) {
                try {
                    target.removeEventListener(i, o);
                } catch(e) {}
            });
        },

        refresh: function() {

        },


        setVideoStatus: function(status) {
            this.videoStatus = status;
            this.publish(status);
        },

        playWithStaticUrl: function(options) {
            
            this.playData = options;

            var isFLV = options["url"].match(/\.flv$/) || options["mime"] == "video/flv";

            
            if (options["url"] === undefined) {
                return this.error(-1);
            }

            //try to reuse existing instances because of http://code.google.com/p/chromium/issues/detail?id=68010
            if (this.player && $('#' + this.htmlId + '_video').size()) {

                this.stopListeningAll(this.player);

                if (this.options.cleanup) {
                    this.options.cleanup(this);
                }

                try {
                    this.player.stop();
                } catch(e) {};

                $('#' + this.htmlId + '_video').attr("src", options["url"]);
                if (options["image"]) $('#' + this.htmlId + '_video').attr("poster", options["image"]);
                $('#' + this.htmlId + '_video').attr("autoplay", isFLV ? false: true);
                $('#' + this.htmlId + '_video').attr("autobuffer", isFLV ? false: true);
                $('#' + this.htmlId + '_video').attr("preload", isFLV ? false: true);
                $('#' + this.htmlId + '_video').css({
                    "display": isFLV ? "none": "block",
                    "width": "",
                    "height": ""
                });

                $('#' + this.htmlId + ' .me-plugin').remove();
                


            } else {

                if (isFLV)
                {
                    // No autoplay here because <video src='xxx.flv' autoplay> will start playing on a GoogleTV
                    // even if video.canPlayType("video/flv")==""        		
                    $("#" + this.htmlId)[0].innerHTML = "<video id='" + this.htmlId + "_video' src='" + options["url"] + "' " + (options["image"] ? "poster='" + options["image"] + "'": "") + " />";
                } else {
                    $("#" + this.htmlId)[0].innerHTML = "<video id='" + this.htmlId + "_video' src='" + options["url"] + "' autoplay='true' autobuffer preload " + (options["image"] ? "poster='" + options["image"] + "'": "") + " />";
                }
            }


            $('#' + this.htmlId + '_video').css({
                //'width'		: (typeof this.options['width'] !== 'undefined') ? this.options['width'] : '100%',
                //'height'	: (typeof this.options['height'] !== 'undefined') ? this.options['height'] : '100%',
                'z-index': 00
            });

            if (this.options["forceAspectRatio"]) {
                if (!this.options['width']) {
                    $('#' + this.htmlId + '_video').css({
                        'height': ($('#' + this.htmlId + '_video').width() / this.options["forceAspectRatio"]) + "px"
                    });
                }
            }

            var that = this;

            //Pull this in MediaElement later
            mejs.HtmlMediaElementShim.myCreate = function(el, o) {
                var
                options = mejs.MediaElementDefaults,
                htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,
                isVideo = (htmlMediaElement.tagName.toLowerCase() == 'video'),
                supportsMediaTag = (typeof(htmlMediaElement.canPlayType) != 'undefined'),
                playback = {
                    method: '',
                    url: ''
                },
                poster = htmlMediaElement.getAttribute('poster'),
                autoplay = htmlMediaElement.getAttribute('autoplay'),
                preload = htmlMediaElement.getAttribute('preload'),
                prop;

                // extend options
                for (prop in o) {
                    options[prop] = o[prop];
                }

                // check for real poster
                poster = (typeof poster == 'undefined' || poster === null) ? '': poster;
                preload = true;
                autoplay = true;

                // test for HTML5 and plugin capabilities
                playback = this.determinePlayback(htmlMediaElement, options, isVideo, supportsMediaTag);
                playback.url = htmlMediaElement.getAttribute('src');

                //console.log(playback);
                if (playback.method == 'native') {
                    // add methods to native HTMLMediaElement
                    this.updateNative(htmlMediaElement, options, autoplay, preload, playback);
                } else if (playback.method !== '') {
                    // create plugin to mimic HTMLMediaElement
                    this.createPlugin(htmlMediaElement, options, isVideo, playback.method, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url).replace('&', '%26') : '', poster, autoplay, preload);
                } else {
                    // boo, no HTML5, no Flash, no Silverlight.
                    this.createErrorMessage(htmlMediaElement, options, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '', poster);
                }
            };


            mejs.HtmlMediaElementShim.myCreate($('#' + this.htmlId + "_video")[0], {
                pluginPath: "/swf/",
                videoWidth: $('#' + this.htmlId + "_video").width(),
                videoHeight: $('#' + this.htmlId + "_video").height(),
                pluginWidth: $('#' + this.htmlId + "_video").width(),
                pluginHeight: $('#' + this.htmlId + "_video").height(),

                enablePluginSmoothing: true,

                type: options["mime"],
                //type:"native",
                //enablePluginDebug:true,
                error: this.handleError,
                success: function(me, domNode) {

                    that.player = me;

                    that.publish('success');

                    that.startListening(me, 'progress', function(ev) {
                        that.publish('progress',[{"totalTime":me.duration,"bufferedBytes":me.bufferedBytes,"totalBytes":me.bytesTotal}]);
                    });
                    
                    that.startListening(me, 'playing', function(ev) {
                        that.setVideoStatus("playing");
                    });
                    
                    that.startListening(me, 'timeupdate', function(ev) {
                        that.publish('timeupdate',[{"currentTime":me.currentTime,"totalTime":me.duration,"bufferedBytes":me.bufferedBytes,"totalBytes":me.bytesTotal}]);
                    });
                    
                    that.startListening(me, 'ended', function(ev) {
                        that.setVideoStatus("stopped");
                        that.publish('ended');
                        that.playNext();
                    });

                    that.startListening(me, 'canplay', function(ev) {
                        me.play();
                        that.setVideoStatus("playing");
                    });

                    that.startListening(me, 'error', function(ev) {
                        //ignore errors about the gif img unloader
                        if (ev.target.src.match(/\.gif$/)) {
                            return;
                        }
                        that.setVideoStatus("stopped");
                        that.error(ev);
                    });

                }
            });

            this.setVideoStatus("loading");

        },

        pause: function() {
            this.setVideoStatus("paused");
            if (this.player) this.player.pause();
        },
        
        resume: function() {
            this.setVideoStatus("playing");
            if (this.player) this.player.play();
        },

        stop: function() {
            this.setVideoStatus("stopped");
            if (this.player) this.player.stop();
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
                    console.log("remove workflow: pause", this.id);
                    this.player.pause();

                } catch(e) {}

                try
                {
                    console.log("remove workflow: stop", this.id);
                    this.player.stop();
                } catch(e) {}

                try
                {
                    console.log("remove workflow: stopped", this.id);
                    this.setVideoStatus("stopped");
                } catch(e) {}

                try
                {
                    console.log("remove workflow: src", this.id);
                    //this.player.src ='/images/mediaelement/empty.mp4'; // setSrc('/images/mediaelement/empty.mp4'); //data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAP///wAAACH/C0FET0JFOklSMS4wAt7tACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                    this.player.setSrc('/images/mediaelement/spacer.gif');
                    console.log("remove workflow: load", this.id);
                    this.player.load();
                } catch(e) {}

                try
                {
                    console.log("remove workflow: restop", this.id);
                    this.player.stop();
                } catch(e) {}

                try
                {
                    console.log("remove workflow: remove", this.id);
                    $(this.player).remove();
                } catch(e) {}

                try
                {
                    console.log("remove workflow: delete", this.id);
                    delete this.player;
                } catch(e) {}


            }
            
            //console.log("REMOVED VIDEO", this.id);
            //$("#"+this.htmlId).html('');
        },

        getHtml: function()
        {
            return "<div id='" + this.htmlId + "'></div>";
        }

    });


})(Joshlib, jQuery);
