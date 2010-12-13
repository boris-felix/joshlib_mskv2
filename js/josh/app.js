(function(J,$) {
	
	
    var lastUid = -1;


	/**
     * @class
     */
	J.App = J.Class({
		
		controls:[],
		
		__constructor:function(appId) {
		    this.debugEvents=true;
    	    this.subscribes={};
    	    this.id = appId;
    	    
			this.menu = new J.Menu(this);
			
			
    	    
		},
		
		
		setBaseHtmlId:function(eltId) {
			this.baseHtml = $("#"+eltId);
		},
		
		setBaseUIElement:function(elt) {
			this.baseUIElement = elt;
		},
		
		setup:function(callback) {
		    callback();
		},
		
		insert:function() {
		    var self=this;
		    this.setup(function() {
		        self.baseUIElement.insert();
		        $.each(self.controls,function(i,v) {
		            J.Control.create(self,v).start();
		        });
		        
		    });
		    
		},
		
		show:function() {
		    //test
		},
		
		
		/*https://github.com/mroderick/PubSubJS/blob/master/pubsub.js*/
		
		/**
         *  PubSub.publish( message[, data] ) -> Boolean
         *  - message (String): The message to publish
         *  - data: The data to pass to subscribers
         *  - sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
         *  Publishes the the message, passing the data to it's subscribers
        **/
		publish:function( message, data, sync ){
		    
		    if (this.debugEvents) {
		        console.log("debugEvents",message, data, sync);
		    }
		    
            // if there are no subscribers to this message, just return here
            if ( !this.subscribes.hasOwnProperty( message ) ){
                return false;
            }
            var self=this;
            var deliverMessage = function(){
                var subscribers = self.subscribes[message];
                var throwException = function(e){
                    return function(){
                        throw e;
                    };
                }; 
                
                for ( var i = 0, j = subscribers.length; i < j; i++ ){
                    
                    //try {
                        //console.log(message,data,subscribers.length,i,subscribers[i]);
                        subscribers[i].func( message, data );
                    //} catch( e ){
                    //    setTimeout( throwException(e), 0);
                    //}
                }
            };
            
            if ( sync === true ){
                deliverMessage();
            } else {
                setTimeout( deliverMessage, 0 );
            }
            return true;
        },
        
        /**
         *  PubSub.subscribe( message, func ) -> String
         *  - message (String): The message to subscribe to
         *  - func (Function): The function to call when a new message is published
         *  Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
        **/
        subscribe : function( message, func ){
            // message is not registered yet
            if ( !this.subscribes.hasOwnProperty( message ) ){
                this.subscribes[message] = [];
            }
        
            // forcing token as String, to allow for future expansions without breaking usage
            // and allow for easy use as key names for the 'this.subscribes' object
            var token = (++lastUid).toString();
            this.subscribes[message].push( { token : token, func : func } );
        
            // return token for unsubscribing
            return token;
        },
        
        /**
         *  PubSub.unsubscribe( token ) -> String | Boolean
         *  - token (String): The token of the function to unsubscribe
         *  Unsubscribes a specific subscriber from a specific message using the unique token
        **/
        unsubscribe : function( token ){
            for ( var m in this.subscribes ){
                if ( this.subscribes.hasOwnProperty( m ) ){
                    for ( var i = 0, j = this.subscribes[m].length; i < j; i++ ){
                        if ( this.subscribes[m][i].token === token ){
                            this.subscribes[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return false;
        }
		
		
	});
	
	J.Apps = {};
	J.Classes = {};
	
	
	
})(Joshlib,jQuery);
