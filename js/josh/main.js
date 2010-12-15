(function( window, $, undefined ) {


    /** @namespace */
	var J = {
	    basePath:"",
	    Class:$.inherit
        
    };
	
	
	//Utils
	
	J.DelayedSwitch = J.Class({
    	__constructor:function(stateON,stateOFF,delayON/*, todo delayOFF*/) {
    		this._on=stateON;
    		this._off=stateOFF;
    		this.delayON=delayON;
    		this.timer=false;
    	},

    	on:function() {
    		if (!this.delayON) {
    			if (this._on) this._on();
    		} else if (!this.timer) {
    		    var self=this;
    			this.timer = setTimeout(function() {
    				self.timer=false;
    				if (self._on) self._on();
    			},this.delayON);
    		}
    	},
    	off:function() {
    		if (this.timer) {
    			clearTimeout(this.timer);
    			this.timer=false;
    		}
    		if (this._off) this._off();
    	},
    	reset:function() {
    		this.off();
    		this.on();
    	}
    });
	
	// node-pool
	J.Pool = function(factory) {
        var self = {};

        var idleTimeoutMillis = factory.idleTimeoutMillis || 30000;
        var reapInterval      = factory.reapIntervalMillis || 1000;

        var availableObjects = [];
        var objectTimeout    = {};
        var waitingClients   = [];
        var obj;
        var count = 0;
        var removeIdleScheduled = false;

        function log(str) {
            if (factory.log) {
                console.log("pool " + factory.name + " - " + str);
            }
        }

        function removeIdle() {
            removeIdleScheduled = false;

            var toKeep = [];
            var now = new Date().getTime();
            for (var i = 0; i < availableObjects.length; i++) {
                var timeout = objectTimeout[availableObjects[i]];
                if (now < timeout) {
                    toKeep.push(availableObjects[i]);
                }
                else {
                    log("removeIdle() destroying obj - now:" + now + " timeout:" + timeout);
                    self.destroy(availableObjects[i]);
                }
            }

            availableObjects = toKeep;

            if (availableObjects.length > 0) {
                log("availableObjects.length=" + availableObjects.length);
                scheduleRemoveIdle();
            }
            else {
                log("removeIdle() all objects removed");
            }
        }

        function scheduleRemoveIdle() {
            if (!removeIdleScheduled) {
                removeIdleScheduled = true;
                setTimeout(removeIdle, reapInterval);
            }
        }

        function dispense() {
            log("dispense() clients=" + waitingClients.length + " available=" + availableObjects.length);
            if (waitingClients.length > 0) {
                obj = null;
                if (availableObjects.length > 0) {
                    log("dispense() - reusing obj");
                    obj = availableObjects.shift();
                    delete objectTimeout[obj];
                    waitingClients.shift()(obj);
                }
                else if (count < factory.max) {
                    count++;
                    log("dispense() - creating obj - count="+count);
                    factory.create(function(obj) {
                        if (waitingClients.length > 0) {
                            waitingClients.shift()(obj);
                        }
                        else {
                            self.returnToPool(obj);
                        }
                    });
                }
            }
        }

        self.borrow = function(callback,priority) {

            if (!priority) priority=0;

            // high priority, currently only supporting <0 or >=0
            if (priority<0) {
                waitingClients.unshift(callback);
            } else {
                waitingClients.push(callback);
            }

            dispense();
        };

        self.destroy = function(obj) {
            count--;
            factory.destroy(obj);
        };

        self.returnToPool = function(obj) {
            //log("return to pool");
            availableObjects.push(obj);
            objectTimeout[obj] = (new Date().getTime() + idleTimeoutMillis);
            log("timeout: " + objectTimeout[obj]);
            dispense();
            scheduleRemoveIdle();
        };

        return self;
    };
	
	
	window.Joshlib = J;


})(window,jQuery);