(function(J, $) {

    /**
     * @class Input interface for touch events
     * @augments J.Input
     */
    J.Inputs.touch = J.Class(J.Input, {

        //untested
        start: function() {
            var self = this;
            $(window).live('touchstart mousedown MozTouchDown',
            function(e) {

                self.app.publish("input", ["enter"]);

            });

        }

    });


})(Joshlib, jQuery);