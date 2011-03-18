(function(J, $, _) {


    /**
     * @class MediaControlsBase media controls
     * @augments J.UI.UIElement
     */
    J.UI.MediaControlsBase = J.Class(J.UIElement,
    /** @lends J.UI.MediaControlsBase.prototype */
    {
        type: "MediaControls", 
        init: function() {
            
            var self = this;
            
            this.initGrid();
            
            this.subscribeToInput();
            
            this.subscribeToPlayerToken=false;
            
            if (this.options.media) {
                var self=this;
                this.subscribe("afterInsert",function() {
                    self.subscribeToPlayer(self.app.ui[self.options.media]);
                });
                
            }
            
        },
        
        initGrid: function() {
            var self=this;
            this.grid = new J.Utils.Grid({
                "grid": [
                [{
                    "id": "prev"
                },
                {
                    "id": "rewind"
                },
                {
                    "id": "p"
                },
                {
                    "id": "forward"
                },
                {
                    "id": "next"
                }]
                ],
                defaultPosition:[2,0],
                inputSource:this,
                "onChange": function(coords, elem) {

                    $("#" + self.htmlId + " div.video-controls .focused").removeClass("focused");

                    if (elem.id == "p") {
                        $("#" + self.htmlId + " .video-play, .video-pause, .video-stop").addClass("focused");
                    } else {
                        $("#" + self.htmlId + " .video-" + elem.id).addClass("focused");
                    }
                },
                
                // Mediaplayer controls are usually at the end of the tree but it's just a default.
                "onExit": function(move,absMove) {
                    if (absMove=="up") {
                        self.app.publish("stateGo", ["focus", "up"]);
                    }
                },
                "onValidate": function(coords,elem) {
                    
                    if (elem.id =="prev") {
                        self.seekBy(-60);
                    } else if (elem.id=="rewind") {
                        self.seekBy(-10);
                    } else if (elem.id=="p") {
                        self.playpause();
                    } else if (elem.id=="forward") {
                        self.seekBy(10);
                    } else if (elem.id=="next") {
                        self.seekBy(60);
                    }
                    
                },
                "orientation": self.options.orientation || "up"
            });
        
        },
        
        refresh:function() {
            
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
        
        
        getHtmlInner:function() {
            
            
            var buttonsHtml = (typeof this.options['buttonsHtml'] !== 'undefined') ? this.options['buttonsHtml'] :
            '<span id="' + this.htmlId + '_button_0" class="video-button video-previous joshover">▐◀</span>\
    							<span id="' + this.htmlId + '_button_1" class="video-button video-reward joshover">◀◀ </span>\
    							<span id="' + this.htmlId + '_button_2.0" class="video-button video-play joshover">▶</span>\
    							<span id="' + this.htmlId + '_button_2.1" style="display:none" class="video-button video-pause joshover">▮▮</span>\
    							<span id="' + this.htmlId + '_button_2.2" style="display:none" class="video-button video-stop joshover">■</span>\
    							<span id="' + this.htmlId + '_button_3" class="video-button video-foward joshover">▶▶</span>\
    							<span id="' + this.htmlId + '_button_4" class="video-button video-next joshover">▶▌</span>';

            var html = '<div class="video-controls">\
    				<div class="video-info">' + ((typeof this.options['pleaseWait'] !== 'undefined') ? this.options['pleaseWait'] : 'Please wait&nbsp;⋅⋅⋅') + '</div>\
    				<div class="video-buttons">' + buttonsHtml +
            '<span class="video-time"><span class="video-currenttime">00:00</span> / <span class="video-duration">00:00</span></span>\
    				</div>\
    				<div class="video-time-rail"><span class="video-time-total"><span class="video-time-loaded"></span><span class="video-time-current"></span></span></div>\
    			</div>';
    			
    		return html;
    	},
    	
        focus: function() {

            var hadFocus = this.hasFocus;
            this.__base();
            var self = this;
            if (!hadFocus) {
                setTimeout(function() {
                    self.grid.goTo(self.grid.options.defaultPosition);
                },
                50);
            }
        },


        subscribeToInput:function() {
            
            var self=this;
            
            //Only mouse for now, fixme
            var timeRail = $("#" + this.htmlId + ' .video-time-rail');
            timeRail.live("click",function(e) {
                self.doSeek((e.pageX - timeRail.offset().left) / timeRail.width());
            });

        },
        
        seekBy:function(seconds) {
            this.player.publish("input",["seekBy",seconds]);
        },
        
        seekTo:function(position) {
            this.player.publish("input",["seekTo",position]);
        },
        
        playpause:function() {
            console.log(this.player.videoStatus);
            if (this.player.videoStatus == "playing") {
                console.log("pause");
                this.player.publish("input",["pause"]);

            } else if (this.player.videoStatus == "stopped" || this.player.videoStatus == "paused") {
                
                this.player.publish("input",["play"]);
            }
            
        },
        
        secondsToTimeCode: function(seconds) {
    		seconds = Math.round(seconds);
    		var minutes = Math.floor(seconds / 60);
    		minutes = (minutes >= 10) ? minutes : "0" + minutes;
    		seconds = Math.floor(seconds % 60);
    		seconds = (seconds >= 10) ? seconds : "0" + seconds;
    		return minutes + ":" + seconds;
    	},
        
        subscribeToPlayer: function(elt) {

            // Already subscribed ?
            if (this.player && this.player.id == elt.id) return;
            
            // Subscribed to another player ?
            if (this.player && this.subscribeToPlayerToken) {
                this.player.unsubscribe(this.subscribeToPlayerToken);
            }
            
            this.player=elt;
            
            var self=this;
            this.subscribeToPlayerToken = elt.subscribe("*",function(ev,data) {
                
                if (ev=="error") {
                    $("#" + self.htmlId + ' .video-buttons').hide();
                    $("#" + self.htmlId + ' .video-info').html(data[1]);
                    $("#" + self.htmlId + ' .video-info').show();
                    
                } else if (ev=="playing") {
                    $("#" + self.htmlId + ' .video-stop ,#' + self.htmlId + ' .video-play').hide();
                    $("#" + self.htmlId + ' .video-pause').show();
                    
                } else if (ev == "paused" || ev == "stopped") {
                    $("#" + self.htmlId + ' .video-stop ,#' + self.htmlId + ' .video-pause').hide();
                    $("#" + self.htmlId + ' .video-play').show();
                  
                } else if (ev=="success") {
                    $("#" + self.htmlId + ' .video-buttons').show();
                    $("#" + self.htmlId + ' .video-info').hide();
                    
                } else if (ev=="progress") {
                    $("#" + self.htmlId + ' .video-duration').text(isNaN(data[0].totalTime) ? '--:--': self.secondsToTimeCode(data[0].totalTime));
                    $("#" + self.htmlId + ' .video-time-loaded').css('width', Math.round(100 * data[0].bufferedBytes / data[0].totalBytes) + '%');
                    
                } else if (ev=="timeupdate") {
                    $("#" + self.htmlId + ' .video-currenttime').text(self.secondsToTimeCode(data[0].totalTime));
                    $("#" + self.htmlId + ' .video-time-current').css('width', Math.round(100 * data[0].currentTime / data[0].totalTime) + '%');
                    $("#" + self.htmlId + ' .video-time-loaded').css('width', Math.round(100 * data[0].bufferedBytes / data[0].totalBytes) + '%');
                    
                } else if (ev=="ended") {
                    $("#" + self.htmlId + ' .video-play ,#' + self.htmlId + ' .video-pause').hide();
                    $("#" + self.htmlId + ' .video-stop').show();
                    
                } else if (ev=="canplay") {
                    $("#" + self.htmlId + ' .video-buttons').show();
                    $("#" + self.htmlId + ' .video-info').hide();
                }
                
            });
            
        }
    });
    
    
    

})(Joshlib, jQuery, _);