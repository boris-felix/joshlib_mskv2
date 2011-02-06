(function(J) {

J.Utils.DelayedSwitch = J.Class(    
    /**
	  @lends J.Utils.DelayedSwitch.prototype
    */
    {
        
	/** 
	    @constructs 
	    @class A on/off switch with delay and reset
	    @param {Function} stateON callback when ON
	    @param {Function} stateOFF callback when OFF
	    @param {Integer} delayON delay before calling stateON
	*/
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


})(Joshlib);