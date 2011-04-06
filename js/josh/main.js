/**
 * @overview
 *
 * Joshlib is a framework for developing cross-platform apps
 * 
 * @name main.js
 * @author Joshfire.com
 * @version 1.0
 */

 (function() {


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
        Class: null,
        
        /**
	     * DOM Ready util
         * @function 
         * @param {Function} Callback
         */
        onReady:function(callback) {
            callback();
        },
        
        /**
	     * Similar to jQuery.extend & Ext.apply
         * @function 
         * @param {Function} Callback
         */        
        extend:function() {
            
        }

    };

    /**
        @namespace A Namespace for utilities
    */
    J.Utils = {};

    /**
           @namespace A Namespace for other classes
     */
    J.Classes = {};

    this.Joshlib = J;
    
    // Attach the namespace to the global scope or for nodeJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Joshlib = J;
    } else {
        
    }




})();