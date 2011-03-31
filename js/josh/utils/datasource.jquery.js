(function(J, $) {

    J.Utils.DataSource = J.Class(J.Utils.DataSourceBase, {

        _request:function(params) {
            return $.ajax(params);
        }

    });


})(Joshlib, jQuery);