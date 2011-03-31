(function(J) {

    var request = require("request");

    J.Utils.DataSource = J.Class(J.Utils.DataSourceBase, {

        _request:function(params) {
            
            //convert $.ajax-style params to a request-like array
            
            request({method:params.type,uri:params.url},function(error,response,body) {
                if (error) {
                    return params.error(error);
                }
                params.success(body);
                
            });
            
            return true;
        }

    });


})(Joshlib);