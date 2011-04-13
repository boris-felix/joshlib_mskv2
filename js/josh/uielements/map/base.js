(function(J) {

    /**
     * @class UI Element container
     * @augments J.UIElement
     */
    J.UI.MapBase = J.Class(J.UIElement,
    /** @lends J.UI.Panel.prototype */
    {
        type: "Map",

        getHtml: function() {
            return "<div style='display:none;' id='" + this.htmlId + "'>" + (this.options["content"] ? this.options["content"] : this.getHtmlInner()) + "</div>";
        }
        
    });

    J.UI.Map = J.UI.MapBase;
    
})(Joshlib);
