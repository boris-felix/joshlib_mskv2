(function(J) {

    var request = require("request");

    J.Utils.DataSource = J.Class(J.Utils.DataSourceBase, {

        _request:function(params) {
            
            //convert $.ajax-style params to a request-like array
            
            var rq = {method:params.type,uri:params.url};

            if (params.data) {
                   rq["body"] = params.data; //serialize?
                   rq["headers"] = {"Content-Type":"application/x-www-form-urlencoded"};
               } else {
                   rq["headers"] = {"Content-Length":"0"};
               }
            
            request(rq,function(error,response,body) {
                if (error) {
                    return params.error(error);
                }
                
                if (params.dataType=="json" || params.dataType=="text json" || params.dataType=="jsonp") {
                    try {
                        var tmp_json = JSON.parse(body);
                    } catch (e) {
                        console.warn("Invalid JSON : ",body);
                        return params.error(e);
                    }
					try{
						params.success(tmp_json);
					}
					catch(ecallback){
						return params.error(ecallback);
						
					}

                    
                } else {
                    params.success(body);
                }
                
                
                
            });
            
            return true;
        }

    });


})(Joshlib);