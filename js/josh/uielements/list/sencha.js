(function(J, Ext, _) {

    /**
     * @class Sencha backend for List UI Element
     * @augments J.UI.ListBase
     */
    J.UI.ListSencha = J.Class(J.UI.ListBase,
    /** @lends J.UI.ListSencha.prototype */
    {

        init: function() {
            
            this.isLoading = true;
            this.focusedIndex = null;
            this.data = [];
            this.id2index={};
            this.grid = new J.Utils.Grid({}); //todo remove
        
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

                singleSelect: true,

                //fullscreen:true,
                
                //floating: true,
                /*width: 350,
                height: 370,*/
                hideOnMaskTap: false,
                style: "padding-bottom:100px;",

                disclosure: {
                    scope: 'test',
                    handler: function(record, btn, index) {
                        alert('Navigate to ' + record.get('id'));
                    }
                },

                store: this.senchaStore
            });
            
            this.senchaElement.on("selectionchange",function(selectionModel,records) {
                if (records.length==0) return;
                
                self.focusedIndex=self.id2index[records[0].data.id];

                self.app.tree.moveTo("focus", self.treeRoot + records[0].data.id);
                self.app.publish("input",["enter"]);
            });

        },

        refresh:function() {
            this.senchaStore.loadData([].concat(this.data));
            //this.senchaStore.sync();
            
        }
        
    });




    /**
     * @class Sencha backend for Bottom Tabs
     * @augments J.UI.ListBase
     */
    J.UI.ListSenchaBottom = J.Class(J.UI.ListBase,
    /** @lends J.UI.ListSenchaBottom.prototype */
    {
    
        init: function() {
            
            this.isLoading = true;
            this.focusedIndex = null;
            this.data = [];
            this.id2index={};
            this.grid = new J.Utils.Grid({}); //todo remove
            
            // Sencha touch bug? : there must be at least one element in the initial items
            // for the element to be rendered correctly.
            this.senchaData=[{
                text: 'Empty',
                iconCls: 'info',
                cls: 'card card1'
            }];
            
            this.senchaElement = new Ext.TabBar({
                dock: 'bottom',
                ui: 'light',
                layout: {
                    pack: 'center'
                },
                items:this.senchaData
            });

        },

        refresh:function() {
            
            //TODO perfs
            this.senchaElement.removeAll();
            for (var i=0;i<this.senchaData.length;i++) {
                this.senchaElement.add(this.senchaData[i]);
            }
            this.senchaElement.doLayout();
        },
        
        setData:function(data) {

            this.data = data;
            this.isLoading = false;
            
            //todo: do this in tree
            for (var i = 0; i < data.length; i++) {
                this.id2index[data[i].id] = i;
            }
            
            var items = [];
            
            for (var i=0;i<this.data.length;i++) {
                items[i] = {
                    id:this.data[i].id,
                    text:this.data[i].label,
                    iconCls: 'info'
                    //cls
                    //badgeText: '4'
                };
            }
            this.senchaData =  items;
        }
    });



})(Joshlib, Ext, _);
