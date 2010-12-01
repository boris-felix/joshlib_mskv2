(function(J,$) {
	
	/**
     * @class
     */
	J.DataSource = J.Class({
		
		__constructor:function(options) {
			this.options = options;
			this.cache = {};
		},
		
		//todo queue, etc.
		query:function(args) {
		    var hash = this.hash(args);
		    
		    if (this.cache[hash]) {
		        return args.success.apply(null,this.cache[hash]["result"]);
		    } else {
				
		        var params = jQuery.extend(true, {}, args);
		        var self = this;
		        params["success"]=function() {
		            self.cache[hash] = {
		                "result":arguments
		            };
		            args["success"].apply(null,arguments);
		        };
		        return $.ajax(params);
		    }
		},
		
		hash:function(args) {
		    return args.url;
		}
		
	});
	
	
})(Joshlib,jQuery);
