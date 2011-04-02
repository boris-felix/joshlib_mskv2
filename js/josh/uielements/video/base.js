(function(J, $) {

    /**
     * @class Abstract video UI Element class
     * @augments J.UIElement
     */
    J.UI.VideoBase = J.Class(J.UIElement,
    /** @lends J.UI.VideoBase.prototype */
    {
        type: "Video",        
        init: function() {
        
        },

        /**
    	 * Play a video
         * @function
         * @param {Object} options Options hash
         */
        
         play: function(options)
         {
             var self = this;
             if (typeof options.url == "function") {
                 options.url(function(error, url) {
                     if (error) {
                         return self.error(4);
                     }
                     options.url = url;
                     self.playWithStaticUrl(options);
                 })
             } else {
                 return self.playWithStaticUrl(options);
             }
         },


         playPrev: function() {


         },

         playNext: function() {
             var that = this;

             var playlistNextMoves = that.app.tree.getData(that.treeCurrent).playlistNext || ["next"];
             
             //console.log("playlistNextMoves", that.treeCurrent, that.app.tree.getData(that.treeCurrent).playlistNext, JSON.stringify(playlistNextMoves));
             
             that.app.tree.resolveMoves(that.treeCurrent, playlistNextMoves,function(newPath) {
                 //console.log("new path",newPath);
                 that.app.tree.moveTo("focus", newPath);
                 that.app.publish("input", ["enter"]);
             });
         },
         
        /**
    	 * Pause the video
         * @function
         */
        pause: function() {
            return;
        },
        
        refresh:function() {
            
        },

        getHtml: function() {
            return "";
        }
    });


})(Joshlib, jQuery);
