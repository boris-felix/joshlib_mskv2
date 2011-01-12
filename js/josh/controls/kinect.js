(function(J,$) {
	
	J.Controls["kinect"] = J.Class(J.Control,{
		

		start:function() {
		    var self=this;
		        
		    DepthJS.init();


            this.cursorWidth = 100;
			
        	this.cursorCanvas = document.createElement("canvas");
            this.cursorCanvas.width= this.cursorWidth;
            this.cursorCanvas.height = this.cursorWidth;
            this.cursorCanvas.style.cssText="z-index:999999;position:absolute; top:0%; left:0%; background:transparent;";
            this.app.baseHtml[0].appendChild(this.cursorCanvas);
            this.cursorWait = this.getCursorWait(this.cursorCanvas.getContext("2d"), 40, {x:this.cursorWidth/2, y:this.cursorWidth/2}, 10, {width: 2, height:10}, {red: 255, green: 17, blue: 58});
            this.cursorWait.stop();
            
            this.cursorMove = this.getCursorMove(this.cursorCanvas.getContext("2d"), 50, {x:this.cursorWidth/2, y:this.cursorWidth/2}, 10, {width: 2, height:10}, {red: 255, green: 17, blue: 58});
            this.cursorMove.start();

            this.hoveredElement = false;

            var mapMouse = true;
            
            
            this.stationaryTimer = new J.DelayedSwitch(function() {
                self.onStationary();
			},false,200);
            
            this.actionTimer = new J.DelayedSwitch(function() {
                self.onAction();
			},false,2000);
            
            
            var moveTo = function(x,y) {
                $(self.cursorCanvas).stop().animate({"left":x,"top":y},100,"linear");
                self.stationaryTimer.reset();
                self.cursorWait.stop();
                self.cursorMove.start();
                self.actionTimer.off();
                $(window).trigger("joshactivity");
            }
            
            
            
            
            if (mapMouse) {
                $(this.app.baseHtml[0]).mousemove(function(event) {
                    moveTo((event.pageX-self.cursorWidth/2)+"px",(event.pageY-self.cursorWidth/2)+"px");
                });
            }

            
			
			var currentDestination = [0,0];
            DepthJS.eventHandlers.onMove = function(evt) {
                
                //Filter the event because of not enough move ?
                if (Math.abs(currentDestination[0]-(100-evt.x))<=1 && Math.abs(currentDestination[1]-(evt.y))<=1) {
                    return;
                }
                currentDestination = [100-evt.x,evt.y];
                
                moveTo(currentDestination[0]+"%",currentDestination[1]+"%");
                
            };
            
			
		},
		
		
		onAction:function() {
		    var self=this;
		    
		    this.cursorWait.stop();
		    
		    var menuPath = $(self.hoveredElement).attr('data-path') || self.hoveredElement.id;
		    self.app.publish("control",["enter",menuPath]);
		
		},
		
		onStationary:function() {
		    var self=this;
		    
            var pointerOffset = $(self.cursorCanvas).offset();
            pointerOffset.top+=this.cursorWidth/2;
            pointerOffset.left+=this.cursorWidth/2;
            
            $('.joshover:visible',this.app.baseHtml[0]).each(function(i,elt) {
                elt=$(elt);
                var offset = elt.offset();
                
                if (
                    (offset.left<=pointerOffset.left && (offset.left+elt.outerWidth())>=pointerOffset.left)
                    &&
                    (offset.top<=pointerOffset.top && (offset.top+elt.outerHeight())>=pointerOffset.top)
                ) {
                    self.hoveredElement=elt[0];
                    
                    var menuPath = elt.attr('data-path') || elt[0].id;

    			    self.app.publish("control",["hover",menuPath]);
    			    self.cursorWait.start();
    			    self.cursorMove.stop();
    			    self.actionTimer.reset();
    				
                }
            });
        },
        
        getCursorMove:function(context, bars, center, innerRadius, size, color) {
            
            return {
                "start":function() {
                    var gradObj = context.createRadialGradient(center.x,center.y,0, center.x,center.y,50);
                    gradObj.addColorStop(0, 'rgba(255,0,0,1)');
                    gradObj.addColorStop(1, 'rgba(255,0,0,0)');
                    context.fillStyle = gradObj;
                    context.rect(0,0,center.x*2,center.y*2);
                    context.fill();
                },
                "stop":function() {
                    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
                }
            }

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
/*
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


 // API available in <= v0.8
 /*******************************
 
 // idleTimer() takes an optional argument that defines the idle timeout
 // timeout is in milliseconds; defaults to 30000
 $.idleTimer(10000);


 $(document).bind("idle.idleTimer", function(){
    // function you want to fire when the user goes idle
 });


 $(document).bind("active.idleTimer", function(){
  // function you want to fire when the user becomes active again
 });

 // pass the string 'destroy' to stop the timer
 $.idleTimer('destroy');
 
 // you can query if the user is idle or not with data()
 $.data(document,'idleTimer');  // 'idle'  or 'active'

 // you can get time elapsed since user when idle/active
 $.idleTimer('getElapsedTime'); // time since state change in ms
 
 ********/
 
 
 
 // API available in >= v0.9
 /*************************
 
 // bind to specific elements, allows for multiple timer instances
 $(elem).idleTimer(timeout|'destroy'|'getElapsedTime');
 $.data(elem,'idleTimer');  // 'idle'  or 'active'
 
 // if you're using the old $.idleTimer api, you should not do $(document).idleTimer(...)
 
 // element bound timers will only watch for events inside of them.
 // you may just want page-level activity, in which case you may set up
 //   your timers on document, document.documentElement, and document.body
 
 
 ********/

(function($){

$.idleTimer = function(newTimeout, elem){
  
    // defaults that are to be stored as instance props on the elem
    
    var idle    = false,        //indicates if the user is idle
        enabled = true,        //indicates if the idle timer is enabled
        timeout = 30000,        //the amount of time (ms) before the user is considered idle
        events  = 'mousemove keydown DOMMouseScroll mousewheel mousedown'; // activity is one of these events
        
    
    elem = elem || document;
    
    
        
    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
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

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */         
    stop = function(elem){
    
        var obj = $.data(elem,'idleTimerObj');
        
        //set to disabled
        obj.enabled = false;
        
        //clear any pending timeouts
        clearTimeout(obj.tId);
        
        //detach the event handlers
        $(elem).unbind('.idleTimer');
    },
    
    
    /* (intentionally not documented)
     * Handles a user event indicating that the user isn't idle.
     * @param {Event} event A DOM2-normalized event object.
     * @return {void}
     */
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
    
      
    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method $.idleTimer
     * @static
     */ 
    
    
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

// Underscore.js 1.1.2
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var o=this,A=o._,r=typeof StopIteration!=="undefined"?StopIteration:"__break__",k=Array.prototype,m=Object.prototype,i=k.slice,B=k.unshift,C=m.toString,p=m.hasOwnProperty,s=k.forEach,t=k.map,u=k.reduce,v=k.reduceRight,w=k.filter,x=k.every,y=k.some,n=k.indexOf,z=k.lastIndexOf;m=Array.isArray;var D=Object.keys,c=function(a){return new l(a)};if(typeof exports!=="undefined")exports._=c;o._=c;c.VERSION="1.1.2";var j=c.each=c.forEach=function(a,b,d){try{if(s&&a.forEach===s)a.forEach(b,d);else if(c.isNumber(a.length))for(var e=
0,f=a.length;e<f;e++)b.call(d,a[e],e,a);else for(e in a)p.call(a,e)&&b.call(d,a[e],e,a)}catch(g){if(g!=r)throw g;}return a};c.map=function(a,b,d){if(t&&a.map===t)return a.map(b,d);var e=[];j(a,function(f,g,h){e[e.length]=b.call(d,f,g,h)});return e};c.reduce=c.foldl=c.inject=function(a,b,d,e){var f=d!==void 0;if(u&&a.reduce===u){if(e)b=c.bind(b,e);return f?a.reduce(b,d):a.reduce(b)}j(a,function(g,h,E){d=!f&&h===0?g:b.call(e,d,g,h,E)});return d};c.reduceRight=c.foldr=function(a,b,d,e){if(v&&a.reduceRight===
v){if(e)b=c.bind(b,e);return d!==void 0?a.reduceRight(b,d):a.reduceRight(b)}a=(c.isArray(a)?a.slice():c.toArray(a)).reverse();return c.reduce(a,b,d,e)};c.find=c.detect=function(a,b,d){var e;j(a,function(f,g,h){if(b.call(d,f,g,h)){e=f;c.breakLoop()}});return e};c.filter=c.select=function(a,b,d){if(w&&a.filter===w)return a.filter(b,d);var e=[];j(a,function(f,g,h){if(b.call(d,f,g,h))e[e.length]=f});return e};c.reject=function(a,b,d){var e=[];j(a,function(f,g,h){b.call(d,f,g,h)||(e[e.length]=f)});return e};
c.every=c.all=function(a,b,d){b=b||c.identity;if(x&&a.every===x)return a.every(b,d);var e=true;j(a,function(f,g,h){(e=e&&b.call(d,f,g,h))||c.breakLoop()});return e};c.some=c.any=function(a,b,d){b=b||c.identity;if(y&&a.some===y)return a.some(b,d);var e=false;j(a,function(f,g,h){if(e=b.call(d,f,g,h))c.breakLoop()});return e};c.include=c.contains=function(a,b){if(n&&a.indexOf===n)return a.indexOf(b)!=-1;var d=false;j(a,function(e){if(d=e===b)c.breakLoop()});return d};c.invoke=function(a,b){var d=i.call(arguments,
2);return c.map(a,function(e){return(b?e[b]:e).apply(e,d)})};c.pluck=function(a,b){return c.map(a,function(d){return d[b]})};c.max=function(a,b,d){if(!b&&c.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});return e.value};c.min=function(a,b,d){if(!b&&c.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});
return e.value};c.sortBy=function(a,b,d){return c.pluck(c.map(a,function(e,f,g){return{value:e,criteria:b.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?1:0}),"value")};c.sortedIndex=function(a,b,d){d=d||c.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(b)?e=g+1:f=g}return e};c.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(c.isArray(a))return a;if(c.isArguments(a))return i.call(a);return c.values(a)};c.size=function(a){return c.toArray(a).length};
c.first=c.head=function(a,b,d){return b&&!d?i.call(a,0,b):a[0]};c.rest=c.tail=function(a,b,d){return i.call(a,c.isUndefined(b)||d?1:b)};c.last=function(a){return a[a.length-1]};c.compact=function(a){return c.filter(a,function(b){return!!b})};c.flatten=function(a){return c.reduce(a,function(b,d){if(c.isArray(d))return b.concat(c.flatten(d));b[b.length]=d;return b},[])};c.without=function(a){var b=i.call(arguments,1);return c.filter(a,function(d){return!c.include(b,d)})};c.uniq=c.unique=function(a,
b){return c.reduce(a,function(d,e,f){if(0==f||(b===true?c.last(d)!=e:!c.include(d,e)))d[d.length]=e;return d},[])};c.intersect=function(a){var b=i.call(arguments,1);return c.filter(c.uniq(a),function(d){return c.every(b,function(e){return c.indexOf(e,d)>=0})})};c.zip=function(){for(var a=i.call(arguments),b=c.max(c.pluck(a,"length")),d=Array(b),e=0;e<b;e++)d[e]=c.pluck(a,""+e);return d};c.indexOf=function(a,b){if(n&&a.indexOf===n)return a.indexOf(b);for(var d=0,e=a.length;d<e;d++)if(a[d]===b)return d;
return-1};c.lastIndexOf=function(a,b){if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};c.range=function(a,b,d){var e=i.call(arguments),f=e.length<=1;a=f?0:e[0];b=f?e[0]:e[1];d=e[2]||1;e=Math.max(Math.ceil((b-a)/d),0);f=0;for(var g=Array(e);f<e;){g[f++]=a;a+=d}return g};c.bind=function(a,b){var d=i.call(arguments,2);return function(){return a.apply(b||{},d.concat(i.call(arguments)))}};c.bindAll=function(a){var b=i.call(arguments,1);if(b.length==
0)b=c.functions(a);j(b,function(d){a[d]=c.bind(a[d],a)});return a};c.memoize=function(a,b){var d={};b=b||c.identity;return function(){var e=b.apply(this,arguments);return e in d?d[e]:d[e]=a.apply(this,arguments)}};c.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};c.defer=function(a){return c.delay.apply(c,[a,1].concat(i.call(arguments,1)))};c.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(b,d)}};c.compose=
function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};c.keys=D||function(a){if(c.isArray(a))return c.range(0,a.length);var b=[],d;for(d in a)if(p.call(a,d))b[b.length]=d;return b};c.values=function(a){return c.map(a,c.identity)};c.functions=c.methods=function(a){return c.filter(c.keys(a),function(b){return c.isFunction(a[b])}).sort()};c.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});
return a};c.clone=function(a){return c.isArray(a)?a.slice():c.extend({},a)};c.tap=function(a,b){b(a);return a};c.isEqual=function(a,b){if(a===b)return true;var d=typeof a;if(d!=typeof b)return false;if(a==b)return true;if(!a&&b||a&&!b)return false;if(a.isEqual)return a.isEqual(b);if(c.isDate(a)&&c.isDate(b))return a.getTime()===b.getTime();if(c.isNaN(a)&&c.isNaN(b))return false;if(c.isRegExp(a)&&c.isRegExp(b))return a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===
b.multiline;if(d!=="object")return false;if(a.length&&a.length!==b.length)return false;d=c.keys(a);var e=c.keys(b);if(d.length!=e.length)return false;for(var f in a)if(!(f in b)||!c.isEqual(a[f],b[f]))return false;return true};c.isEmpty=function(a){if(c.isArray(a)||c.isString(a))return a.length===0;for(var b in a)if(p.call(a,b))return false;return true};c.isElement=function(a){return!!(a&&a.nodeType==1)};c.isArray=m||function(a){return!!(a&&a.concat&&a.unshift&&!a.callee)};c.isArguments=function(a){return!!(a&&
a.callee)};c.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)};c.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};c.isNumber=function(a){return a===+a||C.call(a)==="[object Number]"};c.isBoolean=function(a){return a===true||a===false};c.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)};c.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||a.ignoreCase===false))};c.isNaN=function(a){return c.isNumber(a)&&isNaN(a)};c.isNull=function(a){return a===
null};c.isUndefined=function(a){return typeof a=="undefined"};c.noConflict=function(){o._=A;return this};c.identity=function(a){return a};c.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};c.breakLoop=function(){throw r;};c.mixin=function(a){j(c.functions(a),function(b){F(b,c[b]=a[b])})};var G=0;c.uniqueId=function(a){var b=G++;return a?a+b:b};c.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};c.template=function(a,b){var d=c.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+
a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(e,f){return"',"+f.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(e,f){return"');"+f.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return b?d(b):d};var l=function(a){this._wrapped=a};c.prototype=l.prototype;var q=function(a,b){return b?c(a).chain():a},F=function(a,b){l.prototype[a]=function(){var d=
i.call(arguments);B.call(d,this._wrapped);return q(b.apply(c,d),this._chain)}};c.mixin(c);j(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=k[a];l.prototype[a]=function(){b.apply(this._wrapped,arguments);return q(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];l.prototype[a]=function(){return q(b.apply(this._wrapped,arguments),this._chain)}});l.prototype.chain=function(){this._chain=true;return this};l.prototype.value=function(){return this._wrapped}})();
