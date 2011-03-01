(function(J, $) {

    /**
     * @class Input interface for keyboards including GoogleTV special keys
     * @augments J.Input
     */
    J.Inputs.keyboard = J.Class(J.Input,
    {

        start: function() {
            var self = this;

            $(window).bind('keydown',
            function(e) {
                if (!e) e = window.event;
                console.log("key", e.keyCode);
                switch (e.keyCode)
                {
                case 13:

                    self.app.publish("input", ["enter"]);

                    return false;
                case 27:

                    self.app.publish("input", ["exit"]);

                    return false;
                case 32:
                    //space
                    self.app.publish("input", ["enter"]);

                    return false;
                case 37:

                    self.app.publish("input", ["left"]);

                    return false;
                case 38:

                    self.app.publish("input", ["up"]);

                    return false;
                case 39:

                    self.app.publish("input", ["right"]);

                    return false;
                case 40:

                    self.app.publish("input", ["down"]);

                    return false;

                    //special googletv media keys
                    //http://code.google.com/tv/web/docs/implement_for_tv.html
                case 179:

                    self.app.publish("input", ["play"]);

                    return false;

                case 178:

                    self.app.publish("input", ["stop"]);

                    return false;

                case 176:

                    self.app.publish("input", ["forward"]);

                    return false;

                case 177:

                    self.app.publish("input", ["rewind"]);

                    return false;

                }
            });

        }

    });


})(Joshlib, jQuery);