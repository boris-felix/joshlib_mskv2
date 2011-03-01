(function(J,Ext) {
	
	J.App = J.Class(J.App,{
	    setup:function(callback) {
	        
	        Ext.setup({
                tabletStartupScreen: 'tablet_startup.png',
                phoneStartupScreen: 'phone_startup.png',
                icon: 'icon.png',
                glossOnIcon: false,
                onReady: function() {
                    
                    callback();
                    
                }
            });
	        
	        
	    }
	},{
	    "target":"smartphones/main",
	    "controls":["touch"]
	});
	
	J.UI.List = J.UI.ListSencha;
	J.UI.Video = J.UI.VideoPopUp;
	
	
})(Joshlib,Ext);
