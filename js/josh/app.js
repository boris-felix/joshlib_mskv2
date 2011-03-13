(function(J, $, _) {


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

            this.id = appId;
            this.options = options || {};

            this.tree = new J.Tree(this);
            
            // Instanciated UI Elements
            this.ui = {};

            var self=this;
            this.setup(function(error) {
                if (self.options.insertOnReady) {
                    J.onReady(function() {
                        self.insert();
                    });
                }
                self.publish('appReady');
            });
            

        },
        
        /** 
		    Performs further setup of the app
		    @function 
		    @param {Function} callback when finished 
		*/
        setup:function(callback) {
            callback();
        },

        /** 
		    Adds a UI Element
		    @function 
		    @param {String} id The ID of the 
		    @definition {Object} definition Hash of element properties  
		*/
        addUiElement: function(id,definition) {
            //console.log("Instanciating "+id,definition.type);
            this.ui[id] = new definition.type(this,id,definition);
            if (!definition.parent) {
                this.baseUiElement = id;
            }
            
            //Resolve static "parent" references
            _.each(this.ui,function(elt,k) {
                console.log(elt,k);
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


    });

    // Add events
    J.extend(J.App.prototype,J.PubSub);
    

    /** 
	    @namespace A Namespace for Apps
	*/
    J.Apps = {};


})(Joshlib, jQuery, _);
