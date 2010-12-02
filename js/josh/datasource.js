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
				if (typeof args["whileFreshing"]==='function') { args["whileFreshing"](); }

		        var params = jQuery.extend(true, {}, args);
		        var self = this;
		        params["success"]=function() {
		            self.cache[hash] = {
		                "result":arguments
		            };
					if (typeof args["whenFreshed"]==='function') { args["whenFreshed"](); }
		            args["success"].apply(null,arguments);
		        };
		        return $.ajax(params);
		    }
		},
		
		precache:function(args) {
			// pour gagner sur les lags des appels, récupère avant solicitation.
			// NOTE : optimisation FUTURE , ne pas utiliser en cours de dev !
			var hash = this.hash(args);
		    
		    if (this.cache[hash]) {
		        return true;
		    } else {
				if (typeof args["whilePrecaching"]==='function') { args["whilePrecaching"](); }

		        var params = jQuery.extend(true, {}, args);
		        var self = this;
		        params["success"]=function() {
		            self.cache[hash] = {
		                "result":arguments
		            };
					if (typeof args["whilePrecached"]==='function') { args["whilePrecached"](); }
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
