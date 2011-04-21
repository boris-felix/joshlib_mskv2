
(function(J, Ext) {

    
    J.UI.MultiSelectSencha = J.Class(J.UI.ListBase,
    {

        init: function() {
            
            this.isLoading = true;
            this.focusedIndex = null;
            this.data = [];
            this.id2index={};
            this.grid = new J.Utils.Grid({}); //todo remove
            
            this.selection = this.options.defaultSelection || [];
            
        
            var self=this;
            Ext.regModel('UIListEntry_'+this.id, {
                fields: ['id', 'label', 'type']
            });
            
            this.senchaStore = new Ext.data.Store({
                model: 'UIListEntry_'+self.id,
                sorters: 'id',
                data: [].concat(self.data)
            });
            
            this.senchaElement = new Ext.List({
                itemTpl: '<div>{label}</div>',

                //Definitely a sencha touch bug ; we want multiSelect but it has code for key events.
                multiSelect:false,
                simpleSelect:true,
                singleSelect:false,

                //fullscreen:true,
                
                //floating: true,
                /*width: 350,
                height: 370,*/
                hideOnMaskTap: false,

                disclosure: {
                    scope: 'test',
                    handler: function(record, btn, index) {
                        alert('Navigate to ' + record.get('id'));
                    }
                },

                store: this.senchaStore
            });
            
            this.senchaElement.on("selectionchange",function(selectionModel,records) {
                console.log("sel change",records);
                self.setSelection(records);
            });
            
            
            this.subscribe("afterRefresh",function() {
                self.setSelection(self.selection);
            });
            
            this.subscribe("afterInsert",function() {
                self.setSelection(self.selection);
            });

        },

        refresh:function() {
            this.senchaStore.loadData([].concat(this.data));
            //this.senchaStore.sync();
            
        },
        
        
        setSelection:function(ids) {
            
            if (!_.isEqual(this.selection,ids)) {
                this.publish("selectionChange",[ids]);
            }
            
            this.selection = ids;
            
            
        }
        
    });




    
    
})(Joshlib, Ext);