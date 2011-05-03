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
        
        testCache:function(args) {
            var hash = this.hash(args);
//            console.warn("test cache",this.hash(args),args.cache,this.cache[hash],this.cache,args.cache*1000,(new Date()))
            if (args.cache) {
                var hash = this.hash(args);
                if (this.cache[hash] && (this.cache[hash]["time"]+args.cache*1000)>+(new Date())) {

                    args.success.apply(null, JSON.parse(JSON.stringify(this.cache[hash]["result"])));
                    return true;
                }
            }
            return false;
        },


        request: function(args) {
            var self=this;
            
            if (!this.testCache(args)) {
            
                var params = J.extend({},args);

                params["success"] = function(data) {
                    if (args.cache) {
                        self.cache[self.hash(args)] = {
                            "result": JSON.parse(JSON.stringify([data])),
                            "time":+(new Date())
                        };
                    }
                    
                    self.pool.release();
                    
                    args["success"].apply(null, [data]);
                };
                
                params["error"] = function() {
                    self.pool.release();
                    
                    if (args["error"]) {
                        args["error"].apply(null, arguments);
                    }
                };

                var makeTheQuery = function() {
                    //Been cached in the meantime?
                    if (!self.testCache(args)) {
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
            return JSON.stringify([args.url,args.dataType,args.data,args.type,args.username,args.password]);
        }

    });


})(Joshlib);