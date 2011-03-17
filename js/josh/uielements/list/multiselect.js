(function(J, $, _) {

    /**
     * @class
     * @augments J.UI.ListBase
     */
    J.UI.MultiSelect = J.Class(J.UI.ListBase, {
        
        init:function() {
            this.__base();
            
            this.setSelection(this.options.defaultSelection || []);
            
            var self=this;
            this.grid.options.onValidate = function(coords,elem) {
                if (_.include(self.selection,elem.id)) {
                    self.setSelection(_.without(self.selection,elem.id));
                    
                } else {
                    self.setSelection(self.selection.concat([elem.id]));
                }
            }
        },
        
        setSelection:function(ids) {
            this.selection = ids;
            
            this.publish("selectionChange",[ids]);
            
            $("#" + this.htmlId + " .activated").removeClass("activated");
            
            _.each(this.selection,function(id) {
                $("#" + this.htmlId + '_' + this.grid.id2coords[id][0]).addClass("activated");
            },this);
            
        }
        
    });

})(Joshlib, jQuery, _);