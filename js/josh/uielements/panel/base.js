(function(J) {

    /**
     * @class UI Element container
     * @augments J.UIElement
     */
    J.UI.PanelBase = J.Class(J.UIElement,
    /** @lends J.UI.Panel.prototype */
    {
        type: "Panel",
        placeholder: "",

        getHtml: function() {
            return "<div style='display:none;' id='" + this.htmlId + "'>" + (this.options["content"] ? this.options["content"] : this.placeholder) + "</div>";
        }
    });

    J.UI.Panel = J.UI.PanelBase;
    
})(Joshlib);
