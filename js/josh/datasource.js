(function(J,$) {
	
	/**
     * @class
     */
	J.DataSource = J.Class({
		
		__constructor:function(options) {
			this.options = options;
			this.cache = {};
			this.pools = {};
		},
		
		setupPool:function(name,maxItems) {
		    this.pools[name] = new J.Pool({
		        'name':name,
		        //idleTimeoutMillis : 30000,
		        //priorityRange : 3,
		        'max':maxItems||1
		    });
		},
		
		//todo queue, etc.
		query:function(args) {
		    var hash = this.hash(args);
		    
		    if (this.cache[hash]) {
		        args.success.apply(null,this.cache[hash]["result"]);
		        return;
		    } else {
				if (typeof args["whileFreshing"]==='function') { args["whileFreshing"](); }

                var params = jQuery.extend(true, {}, args);
		        var self = this;
		        params["success"]=function() {
		            self.cache[hash] = {
		                "result":arguments
		            };
		            if (params["pool"]) {
    		            self.pools[params["pool"]].returnToPool();
    		        }
					if (typeof args["whenFreshed"]==='function') { args["whenFreshed"](); }
		            args["success"].apply(null,arguments);
		        };
		        
                var makeTheQuery = function() {
                    //Been cached in the meantime?
                    if (self.cache[hash]) {
        		        params["success"].apply(null,self.cache[hash]["result"]);
        		        return;
        		    } else {
        		        return $.ajax(params);
        		    }
                    
                }
		        
		        if (params["pool"]) {
		            this.pools[params["pool"]].borrow(makeTheQuery);
		        } else {
		            return makeTheQuery();
		        }
		        
		        
		        
		    }
		},
		
		
		
		hash:function(args) {
		    return args.url;
		}
		
	});
	
	
})(Joshlib,jQuery);
