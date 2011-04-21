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
                useCurrentLocation:true,
                mapOptions: {
                    zoom: 12
                }
            };

            opts.cls='joshlib-id-'+this.id;
            
            opts = J.extend(opts,this.options.senchaOptions || {});
            
            this.senchaElement = new Ext.Map(opts);
            
            this.map = this.senchaElement.map;
            
        }
    });

    J.UI.Map = J.UI.MapSencha;
    
})(Joshlib, Ext);
