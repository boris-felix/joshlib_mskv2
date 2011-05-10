(function(J, $, _) {

    J.onReady = $;
    J.extend = _.extend;
	J.getScript = $.getScript; //Todo the josh way


    /* Protect against forgotten console.logs */
    if (window && typeof window.console === "undefined")
    {
        window.console = {
            'log': function() {},
            'message': function() {},
            'warn': function() {},
            'error': function() {},
            'info': function() {},
            'table': function() {},
            'trace': function() {},
            'debug': function() {},
            'profile': function() {},
            'exception': function() {},
            'time': function() {}
        };
    }


})(Joshlib, jQuery, _);