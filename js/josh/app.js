(function(J,$) {
	
	J.App = J.Class({
		
		__constructor:function(appId) {
			this.menu = new J.Menu();
			this.id = appId;
		},
		
		
		setBaseHtmlId:function(eltId) {
			this.baseHtml = $("#"+eltId);
		},
		
		setBaseUIElement:function(elt) {
			this.baseUIElement = elt;
		},
		
		setup:function(callback) {
		    callback();
		},
		
		insert:function() {
		    var self=this;
		    this.setup(function() {
		        self.baseUIElement.insert();
		        console.log(self);
		        $.each(self.controls,function(i,v) {
		            
		            J.Control.create(v).start();
		        });
		        
		    });
		    
		},
		
		show:function() {
		    //test
		},
		
		
		controls:[]
		
	});
	
	J.Apps = {};
	
	
	
})(Joshlib,jQuery);
