(function( window, $, undefined ) {


    var lastUid = -1;

	var J = {
	    basePath:"",
	    Class:$.inherit,
	    
	    
	    debugEvents:true,
	    
	    // https://github.com/mroderick/PubSubJS
	    subscribes:{},
	    
        /**
         *  PubSub.publish( message[, data, sync = false] ) -> Boolean
         *  - message (String): The message to publish
         *  - data: The data to pass to subscribers
         *  - sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
         *  Publishes the the message, passing the data to it's subscribers
        **/
        publish:function( message, data, sync ){
            
            if (J.debugEvents) {
                console.log([message,data,sync]);
            }
            
            // if there are no subscribers to this message, just return here
            if ( !J.subscribes.hasOwnProperty( message ) ){
                return false;
            }
        
            var publish = function(){
                var subscribers = J.subscribes[message];
                var throwException = function(e){
                    return function(){
                        throw e;
                    };
                }; 
                for ( var i = 0, j = subscribers.length; i < j; i++ ){
                    try {
                        subscribers[i].func( message, data );
                    } catch( e ){
                        setTimeout( throwException(e), 0);
                    }
                }
            };
        
            if ( sync === true ){
                publish();
            } else {
                setTimeout( publish, 0 );
            }
            return true;
        },
        
        
        /**
         *  PubSub.subscribe( message, func ) -> String
         *  - message (String): The message to subscribe to
         *  - func (Function): The function to call when a new message is published
         *  Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
        **/
        subscribe:function( message, func ){
            // message is not registered yet
            if ( !J.subscribes.hasOwnProperty( message ) ){
                J.subscribes[message] = [];
            }
        
            // forcing token as String, to allow for future expansions without breaking usage
            // and allow for easy use as key names for the 'J.subscribes' object
            var token = (++lastUid).toString();
            J.subscribes[message].push( { token : token, func : func } );
        
            // return token for unsubscribing
            return token;
        },
        
        /**
         *  PubSub.unsubscribe( token ) -> String | Boolean
         *  - token (String): The token of the function to unsubscribe
         *  Unsubscribes a specific subscriber from a specific message using the unique token
        **/
        unsubscribe:function( token ){
            for ( var m in J.subscribes ){
                if ( J.subscribes.hasOwnProperty( m ) ){
                    for ( var i = 0, j = J.subscribes[m].length; i < j; i++ ){
                        if ( J.subscribes[m][i].token === token ){
                            J.subscribes[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return false;
        }
        
        
    };
	
	window.Joshlib = J;


})(window,jQuery);