(function(J,$) {
	
	
    var lastUid = -1;


	J.App = J.Class(
	    /**
          @lends J.App.prototype
        */
	    {
		
		inputs:[],
		
		/** 
		    @constructs 
		    @class The base application class
		    @param {String} appId Unique identifier for the app
		*/
		__constructor:function(appId) {
		    this.debugEvents=true;
    	    this.subscribes={};
    	    this.id = appId;
    	    
			this.tree = new J.Tree(this);
			
		},
		
		/** 
		    Sets the DOM base element of the app
		    @function 
		    @param {String} eltId ElementID of the base HTML container element
		*/
		setBaseHtmlId:function(eltId) {
			this.baseHtml = $("#"+eltId);
		},
		
		/** 
		    Sets the base UI element of the app
		    @function 
		    @param {J.UIElement} elt Base UI Element (Container for all others)
		*/
		setBaseUIElement:function(elt) {
			this.baseUIElement = elt;
		},
		
		/** 
		    Inserts the app in the DOM
		    @function 
		*/
		insert:function() {
		    var self=this;
		    this.setup(function() {
		        self.baseUIElement.insert();
		        $.each(self.controls,function(i,v) {
		            J.Control.create(self,v).start();
		        });
		        
		    });
		    
		},
		
		
		/** 
		    Setups the app. Overload with app-specific init code
		    @function 
		    @param {Function} callback to call when finished
		*/
		setup:function(callback) {
		    callback();
		},
        
        
		
		/*https://github.com/mroderick/PubSubJS/blob/master/pubsub.js*/
		
		/**
         *  Send an event. Publishes the the message, passing the data to its subscribers
         *  @function
         *  @param {String} message The message to publish
         *  @param data The data to pass to subscribers
         *  @param {Boolean} sync Forces publication to be syncronous, which is more confusing, but faster
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
                    if (self.debugEvents) {
                    //    console.log("debugEventsCallbacks",i,j,message,data,sync);
                    }
                    //try {
                        //console.log(message,data,subscribers.length,i,subscribers[i]);
                        if (subscribers[i]) subscribers[i].func( message, data );
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
         * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
         * @function
         * @param {String} message The message to subscribe to
         * @param {Function} func The function to call when a new message is published
         * @returns {String} token for unsubscribing  
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
         * Unsubscribes a specific subscriber from a specific message using the unique token
         * @function
         * @param {String} token The token of the function to unsubscribe
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
	
	/** 
	    @namespace A Namespace for Apps
	*/
	J.Apps = {};
	
	
})(Joshlib,jQuery);
