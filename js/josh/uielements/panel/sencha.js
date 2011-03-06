(function(J, Ext) {

    /**
     * @class UI Element container
     * @augments J.PanelBase
     */
    J.UI.PanelSencha = J.Class(J.UI.PanelBase,
    /** @lends J.UI.PanelSencha.prototype */
    {
        init:function() {

            var opts = {};
            
            //No parent, it's the root panel.
            if (!this.options.parent) {
                opts.layout = 'card';
                opts.fullscreen=true;
            }
            opts.cls='joshlib-id-'+this.id;
            
            opts = Ext.apply(opts,this.options.senchaOptions || {});
            
            this.senchaElement = new Ext.Panel(opts);
        },
        
        
        /**
		 * Registers one element as a child
		 * @function
		 * @param {J.UIElement} elt The child element
		 */
        registerChild: function(elt) {
            
            if (elt.senchaElement) {
                if (elt.senchaElement.dock) {
                    this.senchaElement.addDocked(elt.senchaElement);
                } else {
                    this.senchaElement.add(elt.senchaElement);
                }
                
                this.senchaElement.doLayout();
            }
                
            
            this.children.push(elt);
        }
        
    });

    J.UI.Panel = J.UI.PanelSencha;
    
})(Joshlib, Ext);
