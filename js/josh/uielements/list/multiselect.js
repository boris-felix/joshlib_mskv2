(function(J, $) {

    /**
     * @class
     * @augments J.UI.ListBase
     */
    J.UI.MultiSelect = J.Class(J.UI.ListBase, {
        
        init:function() {
            this.__base();
            this.grid.options.onValidate = function(coords,elem) {
                console.log("MULTI VAL",elem);
            }
        }
    });

})(Joshlib, jQuery);