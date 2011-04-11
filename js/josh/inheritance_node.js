// http://dl.2ality.com/dl/js/class.js
// Inspired by base2 and Prototype

//Adapted for Joshlib

(function(J,_){
    
    
    var Class = {
    	// The root prototype. Put methods here that you want all classes to have.
        protoype: {
        },
    	_connectTo: function(func, superFunc) {
    		return function() {
    			// save, e.g. when invoking another method in a different object:
    			var tmp = this.__base;
    			this.__base = superFunc;
    			var result = func.apply(this, arguments);
    			this.__base = tmp;
    			return result;
    		}
    	},
        /**
         * Make superProto the prototype of proto. Allow proto to override methods in superProto.
         */
        _extendWith: function(superProto, proto) {
            if (!superProto) {
                return proto;
            }
            var fresh = Object.create(superProto); // superProto is __proto__ of fresh
            // We copy obj into fresh for two reasons:
            // - We can only assign __proto__ to a fresh object (in a cross-browser manner)
            // - We need to modify overriding methods
            Object.getOwnPropertyNames(proto).forEach(function(propName) {
                var desc = Object.getOwnPropertyDescriptor(proto, propName);
                if (typeof desc.value === "function" && typeof superProto[propName] === "function") {
    				desc.value = Class._connectTo(desc.value, superProto[propName]);
                }
                Object.defineProperty(fresh, propName, desc);
            });
            return fresh;
        },
        extend: function(proto) {
            function constr() {
                if (this.__constructor) { // found in prototype
                    this.__constructor.apply(this, arguments);
                }
            }
            constr.prototype = Class._extendWith(this.prototype, proto);
            constr.extend = this.extend; // propagate the API
            return constr; // the constructor *is* the class
        }
    };
  
  
  
  J.Class = function() {
      if (_.isFunction(arguments[0])) {
          return arguments[0].extend(arguments[1]);
      } else {
          return Class.extend(arguments[0]);
      }
  };
  
  
})(Joshlib,_);