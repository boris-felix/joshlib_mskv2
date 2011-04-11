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
                    params.success(JSON.parse(body));
                } else {
                    params.success(body);
                }
                
                
                
            });
            
            return true;
        }

    });


})(Joshlib);