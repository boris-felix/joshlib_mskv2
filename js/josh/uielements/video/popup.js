(function(J, $) {

    /**
     * @class Popup video backend
     * @augments J.UI.VideoBase
     */
    J.UI.VideoPopUp = J.Class(J.UI.VideoBase,
    /** @lends J.UI.VideoPopup.prototype */
    {

        play: function(options) {

            window.open(options["url"]);

        }

    });


})(Joshlib, jQuery);
