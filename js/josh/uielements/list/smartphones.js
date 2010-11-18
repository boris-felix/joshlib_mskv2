(function(J,Ext) {
	
	J.UI.List = J.Class(J.UI.List,{
        
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
