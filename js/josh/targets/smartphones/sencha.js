(function(J,Ext) {
	
	J.App = J.Class(J.App,{
	    
	    target:"smartphones/main",
	    
	    inputs:[], //managed directly by sencha
	    
	    setup:function(callback) {
	        
	        this.extApp = new Ext.Application({
	            
	            launch:function() {
	                callback();
	            }
            });
            
            
            /*
	        Ext.setup({
                tabletStartupScreen: 'tablet_startup.png',
                phoneStartupScreen: 'phone_startup.png',
                icon: 'icon.png',
                glossOnIcon: false,
                onReady: function() {

                    callback();
                    
                }
            });
	        */
	        
	    }/*,
	    
	    
	    insert: function() {
	        
	        var self = this;
            this.beforeInsert(function() {
                self.afterInsert();
            });
        }*/
	});
	
	J.UI.List = J.UI.ListSencha;
	J.UI.Video = J.UI.VideoPopUp;
	
	
})(Joshlib,Ext);
