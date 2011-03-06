(function(J, Ext) {

    /**
     * @class Popup video backend
     * @augments J.UI.VideoBase
     */
    J.UI.VideoSenchaYoutube = J.Class(J.UI.VideoBase,
    /** @lends J.UI.VideoPopup.prototype */
    {

        init:function() {
            
            this.senchaElement = new Ext.Panel({
                layout:'fit',
                //fullscreen:true,
                //hidden:true,
                html: 'Loading...'
            }); 
        },

        play: function(options) {
            
            this.senchaElement.update(
                '<div class="video youtube"><iframe class="youtube-player" type="text/html" width="100%" height="100%" src="http://www.youtube.com/embed/'+options.url+'?autoplay=1" frameborder="0"></iframe></div>'
            );

/*            
            tpl: new Ext.XTemplate(  
                '{[this.renderMedia(values)]}',  
                {
                    renderMedia: function(media) {  
                        if (media.video) {                              
                            if (media.video_host == 'vimeo') {  
                                return '<div class="video vimeo"><iframe class="vimeo-player" type="text/html" width="640" height="385" src="http://player.vimeo.com/video/'+media.video_id+'?byline=0&amp;portrait=0&amp;color=ffffff" frameborder="0"></iframe></div>';  
                            } else {  
                                return '<div class="video youtube"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+media.video_id+'" frameborder="0"></iframe></div>';}  
                            }    
                        }  
                    }  
                }  
            )
            */
        },
        remove:function() {
            if (this.senchaElement) {
                this.senchaElement.update('');
            }
        }

    });


})(Joshlib, Ext);
