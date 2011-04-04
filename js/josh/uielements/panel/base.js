(function(J) {

    /**
     * @class UI Element container
     * @augments J.UIElement
     */
    J.UI.PanelBase = J.Class(J.UIElement,
    /** @lends J.UI.Panel.prototype */
    {
        type: "Panel",

        getHtml: function() {
            return "<div style='display:none;' id='" + this.htmlId + "'>" + (this.options["content"] ? this.options["content"] : this.getInnerHtml()) + "</div>";
        },
        
        getInnerHtml:function() {
            return "";
        },
        
        // Don't empty content on new data
        refresh:function() {
            
        }
    });

    J.UI.Panel = J.UI.PanelBase;
    
})(Joshlib);
