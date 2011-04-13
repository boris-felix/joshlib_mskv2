(function(J, Ext) {

    /**
     * @class UI Element container
     * @augments J.PanelBase
     */
    J.UI.MapSencha = J.Class(J.UI.MapBase,
    /** @lends J.UI.PanelSencha.prototype */
    {
        init:function() {
            var opts = {
                getLocation: true,
                mapOptions: {
                    zoom: 12
                }/*,
                fullscreen:true*/
            };

            opts.cls='joshlib-id-'+this.id;
            
            opts = Ext.apply(opts,this.options.senchaOptions || {});
            
            this.senchaElement = new Ext.Map(opts);
            
        }
    });

    J.UI.Map = J.UI.MapSencha;
    
})(Joshlib, Ext);
