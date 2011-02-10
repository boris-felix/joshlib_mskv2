/**
 * @overview
 *
 * Joshlib is a framework for developing cross-platform apps
 * 
 * @name main.js
 * @author Joshfire.com
 * @version 1.0
 */

 (function(window, $) {


    var J;

    /**
     * @namespace The Joshlib namespace. Exposed in the global JavaScript scope as "Joshlib".
     */
    J = {

        /**
         * The version of Joshlib
         * @type String
         */
        version: "1.0",


        basePath: "",

        /**
	     * JavaScript class implementation with a similar interface to the jQuery.inherit plugin.
         * @function 
         * @return {Class} A JavaScript class.
         */
        Class: $.inherit

    };

    /**
        @namespace A Namespace for utilities
    */
    J.Utils = {};

    /**
           @namespace A Namespace for other classes
     */
    J.Classes = {};


    // Attach the namespace to the global scope
    window.Joshlib = J;


    /* Protect against forgotten console.logs */
    if (typeof window.console === "undefined")
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



})(window, jQuery);