(function(J, $, _) {

    /**
     * @class
     * @augments J.UI.ListBase
     */
    J.UI.MultiSelect = J.Class(J.UI.ListBase, {
        
        init:function() {
            this.__base();
            
            this.selection = this.options.defaultSelection || [];
            
            var self=this;
            this.grid.options.onValidate = function(coords,elem) {
                if (_.include(self.selection,elem.id)) {
                    self.setSelection(_.without(self.selection,elem.id));
                    
                } else {
                    self.setSelection(self.selection.concat([elem.id]));
                }
            }
           
            this.subscribe("afterRefresh",function() {
                self.setSelection(self.selection);
            });
            
            this.subscribe("afterInsert",function() {
                self.setSelection(self.selection);
            });
        },
        
        setSelection:function(ids) {
            
            if (!_.isEqual(this.selection,ids)) {
                this.publish("selectionChange",[ids]);
            }
            
            this.selection = ids;
            
            $("#" + this.htmlId + " .activated").removeClass("activated");
            
            _.each(this.selection,function(id) {
                if (!this.grid.id2coords[id]) return;
                $("#" + this.htmlId + '_' + this.grid.id2coords[id][0]).addClass("activated");
            },this);
            
        }
        
    });

})(Joshlib, jQuery, _);