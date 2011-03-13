(function(J) {
    
    J.PubSub = {
        
        _pubsub_subscribes:{},
        _pubsub_lastuid:-1,
        
        /*https://github.com/mroderick/PubSubJS/blob/master/pubsub.js*/

        /**
         *  Send an event. Publishes the the message, passing the data to its subscribers
         *  @function
         *  @param {String} message The message to publish
         *  @param data The data to pass to subscribers
         *  @param {Boolean} sync Forces publication to be syncronous, which is more confusing, but faster
        **/
        publish: function(message, data, sync) {

            if (J.debug) {
                console.log("publish",message,data,sync);
            }

            // if there are no subscribers to this message, just return here
            if (!this._pubsub_subscribes.hasOwnProperty(message)) {
                return false;
            }
            var self = this;
            var deliverMessage = function() {
                var subscribers = self._pubsub_subscribes[message];
                var throwException = function(e) {
                    return function() {
                        throw e;
                    };
                };

                for (var i = 0, j = subscribers.length; i < j; i++) {

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
            if (!this._pubsub_subscribes.hasOwnProperty(message)) {
                this._pubsub_subscribes[message] = [];
            }

            // forcing token as String, to allow for future expansions without breaking usage
            // and allow for easy use as key names for the 'this._pubsub_subscribes' object
            var token = (++this._pubsub_lastuid).toString();
            this._pubsub_subscribes[message].push({
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
            for (var m in this._pubsub_subscribes) {
                if (this._pubsub_subscribes.hasOwnProperty(m)) {
                    for (var i = 0, j = this._pubsub_subscribes[m].length; i < j; i++) {
                        if (this._pubsub_subscribes[m][i].token === token) {
                            this._pubsub_subscribes[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        }
    };

})(Joshlib);