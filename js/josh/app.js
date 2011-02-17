(function(J, $, _) {


    var lastUid = -1;


    J.App = J.Class(
    /**
          @lends J.App.prototype
        */
    {

        inputs: [],

        /** 
		    @constructs 
		    @class The base application class
		    @param {String} appId Unique identifier for the app
		    @param {Object} options Options for the app
		*/
        __constructor: function(appId,options) {
            this.debugEvents = true;
            this.subscribes = {};
            this.id = appId;
            this.options = options || {};

            this.tree = new J.Tree(this);
            
            // Instanciated UI Elements
            this.ui = {};

            if (this.options.insertOnReady) {
                var self=this;
                $(function() {
                    self.insert();
                });
            }

        },

        /** 
		    Adds a UI Element
		    @function 
		    @param {String} id The ID of the 
		    @definition {Object} definition Hash of element properties 
            
		*/
        addUiElement: function(id,definition) {
            this.ui[id] = new definition.uiElement(this,id,definition);
            if (!definition.parent) {
                this.baseUiElement = id;
            }
            
            //Resolve static "parent" references
            _.each(this.ui,function(elt,k) {
                if (typeof elt.options.parent=="string") {
                    if (this.ui[elt.options.parent]) {
                        elt.options.parent = this.ui[elt.options.parent];
                        elt.options.parent.registerChild(elt);
                    }
                }
            },this);
        },

        /** 
		    Adds UI Elements
		    @function 
		    @param {Object} elementDefinitions An id=>definition hash of UI Elements
            
		*/
        addUiElements: function(elements) {
            //todo accept a javascript array with elt.id properties
            _.each(elements,function(elt,id) {
                this.addUiElement(id,elt);
            },this);
        },

        /** 
		    Setups the app. Overload with app-specific init code
		    @function 
		    @param {Function} callback to call when finished
		*/
        beforeInsert: function(callback) {
            callback();
        },
        
        afterInsert: function() {
            
        },

        /** 
		    Inserts the app in the DOM
		    @function 
		*/
        insert: function() {
            
            this.baseHtml = $("#" + this.options.parentNodeId);
            
            var self = this;
            this.beforeInsert(function() {

                self.ui[self.baseUiElement].insert();
                
                _.each(self.inputs,function(input) {
                    J.Input.create(self, input).start();
                });
                
                self.afterInsert();

            });

        },



        /*https://github.com/mroderick/PubSubJS/blob/master/pubsub.js*/

        /**
         *  Send an event. Publishes the the message, passing the data to its subscribers
         *  @function
         *  @param {String} message The message to publish
         *  @param data The data to pass to subscribers
         *  @param {Boolean} sync Forces publication to be syncronous, which is more confusing, but faster
        **/
        publish: function(message, data, sync) {

            if (this.debugEvents) {
                console.log("debugEvents", message, data, sync);
            }

            // if there are no subscribers to this message, just return here
            if (!this.subscribes.hasOwnProperty(message)) {
                return false;
            }
            var self = this;
            var deliverMessage = function() {
                var subscribers = self.subscribes[message];
                var throwException = function(e) {
                    return function() {
                        throw e;
                    };
                };

                for (var i = 0, j = subscribers.length; i < j; i++) {
                    if (self.debugEvents) {
                        //    console.log("debugEventsCallbacks",i,j,message,data,sync);
                        }
                    //try {
                    //console.log(message,data,subscribers.length,i,subscribers[i]);
                    if (subscribers[i]) subscribers[i].func(message, data);
                    //} catch( e ){
                    //    setTimeout( throwException(e), 0);
                    //}
                }
            };

            if (sync === true) {
                deliverMessage();
            } else {
                setTimeout(deliverMessage, 0);
            }
            return true;
        },

        /**
         * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
         * @function
         * @param {String} message The message to subscribe to
         * @param {Function} func The function to call when a new message is published
         * @returns {String} token for unsubscribing  
        **/
        subscribe: function(message, func) {
            // message is not registered yet
            if (!this.subscribes.hasOwnProperty(message)) {
                this.subscribes[message] = [];
            }

            // forcing token as String, to allow for future expansions without breaking usage
            // and allow for easy use as key names for the 'this.subscribes' object
            var token = (++lastUid).toString();
            this.subscribes[message].push({
                token: token,
                func: func
            });

            // return token for unsubscribing
            return token;
        },

        /**
         * Unsubscribes a specific subscriber from a specific message using the unique token
         * @function
         * @param {String} token The token of the function to unsubscribe
        **/
        unsubscribe: function(token) {
            for (var m in this.subscribes) {
                if (this.subscribes.hasOwnProperty(m)) {
                    for (var i = 0, j = this.subscribes[m].length; i < j; i++) {
                        if (this.subscribes[m][i].token === token) {
                            this.subscribes[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        }


    });

    /** 
	    @namespace A Namespace for Apps
	*/
    J.Apps = {};


})(Joshlib, jQuery, _);
