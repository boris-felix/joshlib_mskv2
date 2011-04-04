(function(J) {


    J.Utils.DataSourceBase = J.Class(
    /**
    	  @lends J.Utils.DataSource.prototype
        */
    {
        /** 
    	    @constructs 
		    @class A Datasource implementation
		    @param {Object} options Options hash
		*/
        __constructor: function(options) {
            this.options = options;
            this.cache = {};
            
            this.pool = new J.Utils.Pool({
                'name': "joshlib",
                //idleTimeoutMillis : 30000,
                //priorityRange : 3,
                'max': options.concurrency || 1,
                'create':function(callback) {
                    callback();
                },
                'destroy':function() {}
            });
            
        },


        request: function(args) {
            var hash = this.hash(args);

            if (this.cache[hash] && this.options.cache) {
                args.success.apply(null, this.cache[hash]["result"]);
                return;
            } else {

                var params = J.extend({},args);
                var self = this;
                params["success"] = function() {
                    if (self.options.cache) {
                        self.cache[hash] = {
                            "result": arguments
                        };
                    }
                    
                    self.pool.release();
                    
                    args["success"].apply(null, arguments);
                };
                
                params["error"] = function() {
                    self.pool.release();
                    
                    if (args["error"]) {
                        args["error"].apply(null, arguments);
                    }
                };

                var makeTheQuery = function() {
                    //Been cached in the meantime?
                    if (self.cache[hash] && self.options.cache) {
                        params["success"].apply(null, self.cache[hash]["result"]);
                        return;
                    } else {
                        return self._request(params);
                    }

                };

                this.pool.acquire(makeTheQuery);
                
            }
        },

        _request:function(params) {
            params.error("no backend included!");
        },


        hash: function(args) {
            return args.url;
        }

    });


})(Joshlib);