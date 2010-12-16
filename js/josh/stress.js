(function(J,$) {
	
	/**
     * @class
     */
	J.Stress = J.Class({
		
		__constructor:function(app,options) {
			this.app = app;
			this.options = options;
			
			this.interval = this.options["interval"] || 50;
			
			this.run = false;
		},
		
		start:function(duration) {
		    this.run=true;
		    
		    this.stressOne();
		    
		    if (duration) {
		        var self;
		        setTimeout(function() {
		            self.stop();
		        },duration);
		    }
		},
		
		stressOne:function() {
		    
		    var randomMoves = ["down","up","left","right","enter"];
		    
		    this.app.publish("control",[randomMoves[Math.floor(Math.random()*randomMoves.length)]]);
		    
		    if (this.run) {
		        var self=this;
    		    setTimeout(function() {
    		        self.stressOne();
    		    },this.interval);
		    }
		    
		},
		
		stop:function() {
		    this.run=false;
		}
		
	});
	
	
	
})(Joshlib,jQuery);
