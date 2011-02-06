(function(J,$) {
	
	
	/**
     * @class Input interface for Kinect
     * @augments J.Input
     */
	J.Inputs.kinect = J.Class(J.Input,{
		
		start:function() {
		    var self=this;
		        
		    DepthJS.init();


            this.cursorWidth = 100;
			
        	this.cursorCanvas = document.createElement("canvas");
            this.cursorCanvas.width= this.cursorWidth;
            this.cursorCanvas.height = this.cursorWidth;
            this.cursorCanvas.style.cssText="z-index:999998;position:absolute; top:0%; left:0%; background:transparent;";
            this.app.baseHtml[0].appendChild(this.cursorCanvas);
            
            this.cursorWaitCanvas = document.createElement("canvas");
            this.cursorWaitCanvas.width= this.cursorWidth;
            this.cursorWaitCanvas.height = this.cursorWidth;
            this.cursorWaitCanvas.style.cssText="z-index:999999;position:absolute; top:0%; left:0%; background:transparent;";
            this.app.baseHtml[0].appendChild(this.cursorWaitCanvas);
            
            
            this.cursorWait = this.getCursorWait(this.cursorWaitCanvas.getContext("2d"), 40, {x:this.cursorWidth/2, y:this.cursorWidth/2}, 10, {width: 2, height:10}, {red: 255, green: 17, blue: 58});
            this.cursorWait.stop();
            
            this.cursorMove = this.getCursorMove(this.cursorCanvas.getContext("2d"), 50, {x:this.cursorWidth/2, y:this.cursorWidth/2}, 10, {width: 2, height:10}, {red: 255, green: 17, blue: 58});

            this.hoveredElement = false;

            var mapMouse = true;
            
            
            this.stationaryTimer = new J.DelayedSwitch(function() {
                self.onStationary();
			},false,100);
            
            this.actionTimer = new J.DelayedSwitch(function() {
                self.onAction();
			},function() {
			    $(self.cursorCanvas).show();
			},2000);
            
            
            var moveTo = function(x,y) {
                //console.log("testmove",self.hoveredElement,x,y);
                
                //is the focus still in the current hovered element?
                if (self.hoveredElement && self.hoveredElement[1]<=x && self.hoveredElement[3]>=x && self.hoveredElement[2]<=y && self.hoveredElement[4]>=y) {
                    return;
                }
                self.hoveredElement=false;
                
                $(self.cursorCanvas).stop().animate({"left":x-self.cursorWidth/2,"top":y-self.cursorWidth/2},50,"linear");
                
                self.stationaryTimer.reset();
                self.cursorWait.stop();
                $(self.cursorCanvas).show();
                self.actionTimer.off();
                $(window).trigger("joshactivity");
            }
            
            
            
            
            if (mapMouse) {
                $(this.app.baseHtml[0]).mousemove(function(event) {
                    moveTo(event.pageX,event.pageY);
                });
            }

            
			
			var currentDestination = [0,0];
            DepthJS.eventHandlers.onMove = function(evt) {
                
                //Filter the event because of not enough move ?
                if (Math.abs(currentDestination[0]-(100-evt.x))<=1 && Math.abs(currentDestination[1]-(evt.y))<=1) {
                    return;
                }
                currentDestination = [100-evt.x,evt.y];
                
                //use a smaller selection space, for bugs with edges
                //margins in percents, CSS order (1.1 for 10%)
                var margins = [1.1,1.1,1.1,1.1];
                
                //TODO
                
                var appOffset = $(this.app.baseHtml[0]).offset();
                var appBox = [appOffset.left,appOffset.top,appOffset.left+$(this.app.baseHtml[0]).outerWidth(),appOffset.top+$(this.app.baseHtml[0]).outerHeight()]
                
                moveTo((appBox[2]-appBox[0])*currentDestination[0]+appBox[0],(appBox[3]-appBox[1])*currentDestination[1]+appBox[1]);
                
            };
            
			
		},
		
		
		onAction:function() {
		    var self=this;
		    
		    $(self.cursorCanvas).hide();
		    self.cursorWait.stop();
		    
		    var menuPath = $(self.hoveredElement).attr('data-path') || self.hoveredElement.id;
		    self.app.publish("input",["enter",menuPath]);
		
		},
		
		
		getUnderlyingJoshoverElement:function(x,y) {
		    
		    var ret;
		    $('.joshover:visible',this.app.baseHtml[0]).each(function(i,elt) {
                elt=$(elt);
                var offset = elt.offset();
                
                if (
                    (offset.left<=x && (offset.left+elt.outerWidth())>=x)
                    &&
                    (offset.top<=y && (offset.top+elt.outerHeight())>=y)
                ) {
                    //element, boundaries
		            ret= [elt[0],offset.left,offset.top,offset.left+elt.outerWidth(),offset.top+elt.outerHeight()];
		        }
		    });
		    return ret;
		    
		},
		
		onStationary:function() {
		    var self=this;
		    
            var pointerOffset = $(self.cursorCanvas).offset();
            pointerOffset.top+=parseInt(this.cursorWidth/2);
            pointerOffset.left+=parseInt(this.cursorWidth/2);
            
            var underElement = this.getUnderlyingJoshoverElement(pointerOffset.left,pointerOffset.top);
            
            if (!underElement) {
                self.hoveredElement=false;
                return;
            }
            
            //no changes
            if (self.hoveredElement[0]==underElement[0]) return;
            
            self.actionTimer.reset();
            
            self.hoveredElement=underElement;
                    
            var menuPath = $(underElement[0]).attr('data-path') || underElement[0].id;

    		self.app.publish("input",["hover",menuPath]);
    		$(self.cursorCanvas).hide();
    		
    		//console.log("wait start",self.cursorWait,self.cursorWaitCanvas);
    		
    		self.cursorWait.start();
    			    
    		$(self.cursorWaitCanvas).css({"left":((underElement[1]+underElement[3])/2-self.cursorWidth/2)+"px","top":((underElement[2]+underElement[4])/2-self.cursorWidth/2)+"px"});
    		
    		
        },
        
        getCursorMove:function(context, bars, center, innerRadius, size, color) {
            
           /* var drawn=false;
            return {
                "start":function() {
                    if (drawn) return;
                    drawn=true;*/
                    var gradObj = context.createRadialGradient(center.x,center.y,0, center.x,center.y,50);
                    gradObj.addColorStop(0, 'rgba(255,0,0,1)');
                    gradObj.addColorStop(1, 'rgba(255,0,0,0)');
                    context.fillStyle = gradObj;
                    context.rect(0,0,center.x*2,center.y*2);
                    context.fill();
                /*},
                "stop":function() {
                    drawn=false;
                    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
                }
            }*/

        },
        
        getCursorWait:function(context, bars, center, innerRadius, size, color) {
            var animating = true,
                currentOffset = 0;

            function makeRGBA(){
                return "rgba(" + [].slice.call(arguments, 0).join(",") + ")";
            }
            function drawBlock(ctx, barNo){
                ctx.fillStyle = makeRGBA(color.red, color.green, color.blue, (bars+1-barNo)/(bars+1));
                ctx.fillRect(-size.width/2, 0, size.width, size.height);
            }
            function calculateAngle(barNo){
                return 2 * barNo * Math.PI / bars;
            }
            function calculatePosition(barNo){
                angle = calculateAngle(barNo);
                return {
                    y: (innerRadius * Math.cos(-angle)),
                    x: (innerRadius * Math.sin(-angle)),
                    angle: angle
                };
            }
            
            function draw(ctx, offset) {
                clearFrame(ctx);
                ctx.save();
                ctx.translate(center.x, center.y);
                for(var i = 0; i<bars; i++){
                    var curbar = (offset+i) % bars,
                        pos = calculatePosition(curbar);
                    ctx.save();
                    ctx.translate(pos.x, pos.y);
                    ctx.rotate(pos.angle);
                    drawBlock(context, i);
                    ctx.restore();
                }
                ctx.restore();
            }
            function clearFrame(ctx) {
                ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
            }
            function nextAnimation(){
                if (!animating) {
                    return;
                };
                currentOffset = (currentOffset + 1) % bars;
                draw(context, currentOffset);
                setTimeout(nextAnimation, 50);
            }
            nextAnimation(0);
            return {
                stop: function (){
                    animating = false;
                    clearFrame(context);
                },
                start: function (){
                    currentOffset = parseInt(bars/2);
                    animating = true;
                    nextAnimation(0);
                }
            };
        }

		
	});
	
	
	
	//depthjs/extension-common/background/backend.js
	
	
    console.log('background.html Starting DepthJS');
    window.DepthJS = {
      __VERSION__: '0.3',
      verbose: true,
      backend: {},
      eventHandlers: {},
      cv: {},
      tools: {},
      portsByTabId: {},
      tabs: {},
      test: {},
      toolbar: {},
      browser: {},
      background: {},
      registerMode: "selectorBox"
    };

    DepthJS.init = function () {
//      DepthJS.initBrowserBackground();
//      DepthJS.browser.addBackgroundListener(DepthJS.background.handleMessage);
      if (DepthJS.verbose) console.log("Connecting WebSocket");
      if (!DepthJS.backend.connect()) {
        if (DepthJS.verbose) console.log("Couldn't connect... aborting");
        return;
      }
    };


    (function() {
    var lastMessages = [];
    DepthJS.logSortaVerbose = function(type, fullMessage) {
      lastMessages.push({type: type, data:fullMessage});
    };

    function print() {
      setTimeout(print, 1000);
      if (lastMessages.length == 0) return;
      var counts = {};
      var lastByType = {};
      _.each(lastMessages, function(msg) {
        if (counts[msg.type] == null) counts[msg.type] = 0;
        counts[msg.type] = counts[msg.type] + 1;
        lastByType[msg.type] = msg.data;
      });

      var alphabeticalKeys = _.keys(counts).sort();
      console.log("------" + (new Date() + ""));
      _.each(alphabeticalKeys, function(type) {
        console.log(["   " + counts[type] + " " + type + "; last = ", lastByType[type]]);
      });

      lastMessages = [];
    }
    setTimeout(print, 1000);

    })();
	
	//depthjs/extension-common/background/backend.js
	
	var WS_CONNECTING = 0;
    var WS_OPEN = 1;
    var WS_CLOSING = 2;
    var WS_CLOSED = 3;

    DepthJS.backend.eventWs = null;
    DepthJS.backend.imageWs = null;
    DepthJS.backend.depthWs = null;
    DepthJS.backend.host = "localhost";
    DepthJS.backend.port = 8000;
    DepthJS.backend.connecting = false;
    DepthJS.backend.connected = false;

    DepthJS.backend.connect = function() {
      DepthJS.backend.connecting = true;
      var connected = 0;
      function check() {
        connected++;
        if (connected == 3) {
          if (DepthJS.verbose) console.log("All 3 connected");
          DepthJS.backend.connecting = false;
          DepthJS.backend.connected = true;
        }
      }

      // If we do not connect within a timeout period,
      // effectively cancel it and let the popup know.
      setTimeout(function() {
        if (connected != 3) {
          DepthJS.backend.disconnect();
        }
      }, 3000);

      return _.all(_.map(["event", "image", "depth"], function(stream) {
        var path = "ws://" + DepthJS.backend.host + ":" + DepthJS.backend.port + "/" + stream;
        if (DepthJS.verbose) console.log("Connecting to " + stream + " stream on " + path);

        // Clear out any old sockets
        var oldSocket = DepthJS.backend[stream+"Ws"];
        if (oldSocket != null) {
          oldSocket.onmessage = null;
          oldSocket.onclose = null;
          oldSocket.onopen = null;

          if (oldSocket.readyState == WS_OPEN ||
              oldSocket.readyState == WS_CONNECTING) {
            oldSocket.close();
          }
        }

        var socket = new WebSocket(path);
        DepthJS.backend[stream+"Ws"] = socket;

        socket.onmessage = function(data){
          DepthJS.backend.onMessage(stream, data);
        };

        socket.onclose = function() {
          DepthJS.backend.onDisconnect(stream);
        };

        socket.onopen = function() {
          DepthJS.backend.onConnect(stream);
          check();
        };

        return true;
      }));
    };

    DepthJS.backend.onMessage = function (stream, data) {
      if (stream == "event") {
        if (data === undefined || data.data == null) {
          return;
        }
        var msg = JSON.parse(data.data);
        if (!$.isPlainObject(msg)) {
          if (DepthJS.verbose) console.log('Unknown message: ' + data);
          return;
        }
        //DepthJS.logSortaVerbose(msg.type, msg);
        var handler = DepthJS.eventHandlers["on"+msg.type];
        if (handler != null) {
          handler(msg.data);
        }

        msg.jsonRep = data.data;
        //console.log("msg",msg);
      } else if (stream == "image") {
        /*DepthJS.eventHandlers.onImageMsg(data);*/
      } else if (stream == "depth") {
        /*DepthJS.eventHandlers.onDepthMsg(data);*/
      }
    };

    DepthJS.backend.disconnect = function() {
      DepthJS.backend.connected = false;
      if (DepthJS.verbose) console.log("Disconnecting");
      return _.map(["event", "image", "depth"], function(stream) {
        var oldSocket = DepthJS.backend[stream+"Ws"];
        if (oldSocket != null) {
          oldSocket.onmessage = null;
          oldSocket.onclose = null;
          oldSocket.onopen = null;

          if (oldSocket.readyState == WS_OPEN ||
              oldSocket.readyState == WS_CONNECTING) {
            oldSocket.close();
          }
        }
        DepthJS.backend[stream+"Ws"] = null;
      });
    };

    DepthJS.backend.onDisconnect = function (stream) {
      if (DepthJS.verbose) console.log("Disconnected on " + stream + " stream");
      // If one is closed, close them all.
      DepthJS.backend.disconnect();
    };

    DepthJS.backend.onConnect = function (stream) {
      if (DepthJS.verbose) console.log("Connect on " + stream + " stream");
    };
    
    
    
    
    
    DepthJS.state = null;







})(Joshlib,jQuery);



/*!
 * jQuery idleTimer plugin
 * version 0.9.100511
 * by Paul Irish. 
 *   http://github.com/paulirish/yui-misc/tree/
 * MIT license
 
 * adapted from YUI idle timer by nzakas:
 *   http://github.com/nzakas/yui-misc/
*/ 

(function($){

$.idleTimer = function(newTimeout, elem){
  
    // defaults that are to be stored as instance props on the elem
    
    var idle    = false,        //indicates if the user is idle
        enabled = true,        //indicates if the idle timer is enabled
        timeout = 30000,        //the amount of time (ms) before the user is considered idle
        events  = 'mousemove keydown DOMMouseScroll mousewheel mousedown'; // activity is one of these events
        
    
    elem = elem || document;
    
    
    var toggleIdleState = function(myelem){
    
        // curse you, mozilla setTimeout lateness bug!
        if (typeof myelem == 'number') myelem = undefined;
    
        var obj = $.data(myelem || elem,'idleTimerObj');
        
        //toggle the state
        obj.idle = !obj.idle;
        
        // reset timeout counter
        obj.olddate = +new Date;
        
        //fire appropriate event
        
        // create a custom event, but first, store the new state on the element
        // and then append that string to a namespace
        var event = jQuery.Event( $.data(elem,'idleTimer', obj.idle ? "idle" : "active" )  + '.idleTimer'   );
        
        // we dont want this to bubble
        event.stopPropagation();
        $(elem).trigger(event);            
    },
    
    stop = function(elem){
    
        var obj = $.data(elem,'idleTimerObj');
        
        //set to disabled
        obj.enabled = false;
        
        //clear any pending timeouts
        clearTimeout(obj.tId);
        
        //detach the event handlers
        $(elem).unbind('.idleTimer');
    },
    
    
    handleUserEvent = function(){
    
        var obj = $.data(this,'idleTimerObj');
        
        //clear any existing timeout
        clearTimeout(obj.tId);
        
        
        
        //if the idle timer is enabled
        if (obj.enabled){
        
          
            //if it's idle, that means the user is no longer idle
            if (obj.idle){
                toggleIdleState(this);           
            } 
        
            //set a new timeout
            obj.tId = setTimeout(toggleIdleState, obj.timeout);
            
        }    
     };
    

    
    var obj = $.data(elem,'idleTimerObj') || new function(){};
    
    obj.olddate = obj.olddate || +new Date;
    
    //assign a new timeout if necessary
    if (typeof newTimeout == "number"){
        timeout = newTimeout;
    } else if (newTimeout === 'destroy') {
        stop(elem);
        return this;  
    } else if (newTimeout === 'getElapsedTime'){
        return (+new Date) - obj.olddate;
    }
    
    //assign appropriate event handlers
    $(elem).bind($.trim((events+' ').split(' ').join('.idleTimer ')),handleUserEvent);
    
    
    obj.idle    = idle;
    obj.enabled = enabled;
    obj.timeout = timeout;
    
    
    //set a timeout to toggle state
    obj.tId = setTimeout(toggleIdleState, obj.timeout);
    
    // assume the user is active for the first x seconds.
    $.data(elem,'idleTimer',"active");
    
    // store our instance on the object
    $.data(elem,'idleTimerObj',obj);  
    

    
}; // end of $.idleTimer()


// v0.9 API for defining multiple timers.
$.fn.idleTimer = function(newTimeout){
  
  this[0] && $.idleTimer(newTimeout,this[0]);
  
  return this;
}
    

})(jQuery);