(function(J,Ext) {

	/**
     * @class Sencha backend for List UI Element
     * @augments J.UI.ListBase
     */	
	J.UI.ListSencha = J.Class(J.UI.ListBase,
	    /** @lends J.UI.ListSencha.prototype */
	    {
        
		getHtml:function() {
			Ext.regModel('UIListEntry', {
                fields: ['id','label', 'type']
            });

            var list = (new Ext.List({
                itemTpl: '<div>{label}</div>',
            
                singleSelect: true,
                
                /*
                fullscreen:true,
                */
                floating: true,
                width: 350,
                height: 370,
                hideOnMaskTap: false,
                style:"margin-top:400px;",
                
                disclosure: {
                    scope: 'test',
                    handler: function(record, btn, index) {
                        alert('Navigate to ' + record.get('id'));
                    }
                },
            
                store: new Ext.data.Store({
                    model: 'UIListEntry',
                    sorters: 'id',
            
            
                    data: this.data
                })
            }));
            
            list.show();
           
           return "";
		}
		
	});
	
	
	
	
})(Joshlib,Ext);
