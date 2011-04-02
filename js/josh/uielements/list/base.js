(function(J, $, _) {

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    var orientations = ["up", "right", "down", "left"];
    var inv = {
        "up": "down",
        "down": "up",
        "left": "right",
        "right": "left"
    };


    /**
     * @class Abstract list UI Element class
     * @augments J.UIElement
     */
    J.UI.ListBase = J.Class(J.UIElement,
    /** @lends J.UI.ListBase.prototype */
    {
        type: "List",
        data: [],
        // style="display:none;"
        defaultOptions: {
            //where is the tree unfolding to
            "orientation": "up",
            "persistFocus": true,
            "autoScroll": false,
            
            "autoScrollMargin":200,
            "autoScrollMarginLeft":0,
            "autoScrollMarginRight":0,
            
            "autoScrollOffset":300,
            "autoScrollOffsetLeft":0,
            "autoScrollOffsetRight":0,
            
            "scrollAnimate":200,
            "scrollEasing":"swing",
            
            "incrementalRefresh":false,
            
            "itemTemplate": "<li id='{{ htmlId }}_{{ i }}' josh-ui-element='{{ id }}' josh-grid-id='{{ item.id }}' data-path='{{ treeRoot }}{{ item.id }}' class='joshover'><img src='{{ item.image }}' /><br/>{{ item.label }}</li>",

            "loadingTemplate": "<li class='loading'>Loading...</li>"
            
        },

        init: function() {
            this.isLoading = true;
            this.focusedIndex = null;
            this.data = [];

            var self = this;
            this.grid = new J.Utils.Grid({
                "grid": [
                []
                ],
                //defaultPosition:[0,0],
                inputSource:this,
                "onChange": function(coords, elem) {
                    //console.log("onChange", coords, elem);
                    
                    self.focusIndex(coords[0]);
                },
                "onExit": function(move,absMove) {
                    //go to leaf
                    //console.log("onExit", side);
                    
                    if (self.options.beforeGridExit) {
                        if (!self.options.beforeGridExit(self,move,absMove)) {
                            return;
                        }
                    }
                    
                    if (absMove=="down") {
                        self.app.tree.move("focus", "down");


                        //go to parent
                    } else if (absMove=="up") {
                        if (self.treeRoot == '/') return false;

                        self.app.tree.move("focus", "up");

                    }
                },
                "onValidate":function(coords,elem) {
                    
                    var dest = self.treeRoot + elem.id;
                    self.app.tree.move("current", dest+"");
                },
                "orientation": this.options.orientation
            });
            
            /*
            this.subscribe("*",function(ev,data) {
                if (!self.hasFocus) {
                    self.hasFocus=true;
                    self.focusIndex(self.focusedIndex || 0);
                }
            });
            */
                
        },

        getHtmlInner: function()
        {
            if (this.isLoading)
            {
                if (typeof this.options.loadingTemplate == "function") {
                    return this.options.loadingTemplate(this);
                } else {
                    return _.template(this.options.loadingTemplate,this);
                }

            } else {
                return "<ul>"+this._getItemsHtml(0)+"</ul>";
            }
        },
        
        _getItemsHtml:function(itemFrom) {
            var ret = [];
            if (typeof this.options.loadingTemplate == "function") {
                for (var i = itemFrom,l=this.data.length; i < l; i++) {
                    ret.push(this.options.itemTemplate(this,this.htmlId,this.data[i]));
                }
            } else {
                var tmpl = _.template(this.options.itemTemplate);
                for (var i = itemFrom,l=this.data.length; i < l; i++) {
                    this.item=this.data[i];
                    this.i = i;
                    ret.push(tmpl(this));
                }
            }
            return ret.join("");
        },

        setTreeRoot: function(treeRoot) {
            this.__base(treeRoot.replace(/\/[^\/]*$/, "/"));
        },


        refresh: function() {
            
            if (this.options.incrementalRefresh && $("#" + this.htmlId+" ul").size()) {
                
                //Try to sync HTML and data incrementally
                
                var maxSyncedIndex = 0;
                var liElements = $("#" + this.htmlId+" li");
                for (var i=0;i<this.data.length;i++) {
                    if (liElements.slice(i,i+1).attr("josh-grid-id")!=this.data[i].id) {
                        maxSyncedIndex=i;
                        break;
                    }
                }
                liElements.slice(maxSyncedIndex).remove();

                $("#" + this.htmlId+" ul").append(this._getItemsHtml(maxSyncedIndex));
                
                this.publish("afterRefresh");
                
            } else {
                this.__base();
            }
            
            if (this.focusedIndex !== null) {
                $("#" + this.htmlId + '_' + this.focusedIndex).addClass("focused");
            }
            //autoscroll ?
            
        },

        setLoading: function(isLoading) {
            this.isLoading = isLoading;
        },

        setData: function(data) {
            this.__base(data);

            this.grid.setGrid([data]);

            //this.grid.currentCoords=false;
        },
        /*
        blur:function(path) {
            this.grid.currentCoords=false;
            this.__base(path);
        },
		*/
        focus: function(path)
        {

            if (path.charAt(path.length - 1) == "/") {
                this.grid.goTo([0, 0]);
            } else {
                var id = path.split("/").pop();
                this.grid.goToId(id);
            }
            /*
            if (this.options["persistFocus"] && this.focusedIndex !== null) {
                $("#" + this.htmlId + '_' + this.focusedIndex).addClass("focused");
            }
            */

            this.__base(path);
        },
        
        blur: function(path) {
            this.__base(path);
            this.grid.currentCoords=false;
            
            $("#" + this.htmlId + '_' + this.focusedIndex).removeClass("focused");
            
            if (!this.options["persistFocus"]) {
                this.focusedIndex=null;
            }
        },

        resetIndex: function() {
            this.focusIndex(null);
            this.grid.currentCoords = false;
        },

        autoScroll: function() {

            if (this.data[this.focusedIndex] == undefined) return;
            
            var elt = $('#' + this.htmlId + '_' + this.focusedIndex);
            var list = $('#' + this.htmlId);
            var ul = $('#' + this.htmlId+" ul");
            
            if (!elt.length || !list) return;
            
            var safetyMargin = 100;
            var animate = this.options.scrollAnimate;
            
            if (this.options.orientation == "up" || this.options.orientation == "down") {
                var totalPixels = $(list).width();
                var movingProperty = "left";
                var eltPixelsToStart = [elt.position().left,elt.position().left+elt.width()];
                
                
            } else {
                var totalPixels = $(list).height();
                var movingProperty = "top";
                var eltPixelsToStart = [elt.position().top,elt.position().top+elt.height()];
            }
            //TODO store the target offset elsewhere (when moving, we don't care about intermediate values)
            var currentOffset = parseInt(ul.css(movingProperty));
            
            var newOffset = currentOffset;
            
            if (eltPixelsToStart[1]+currentOffset+(this.options.autoScrollMarginRight || this.options.autoScrollMargin)>totalPixels) {
                newOffset = -eltPixelsToStart[0] + (this.options.autoScrollOffsetLeft || this.options.autoScrollOffsetLeft);
            } else if (eltPixelsToStart[0]+currentOffset-(this.options.autoScrollMarginLeft || this.options.autoScrollMargin)<0) {
                newOffset = totalPixels -eltPixelsToStart[1] - (this.options.autoScrollOffsetRight || this.options.autoScrollOffset);
            }
            
            //console.log("autoScroll",eltPixelsToStart,totalPixels,currentOffset,newOffset);
            
            newOffset = Math.min(0,newOffset);
            
            if (newOffset!=currentOffset) {
                var moveObj={}
                moveObj[movingProperty] = newOffset+"px";
                if (animate) {
                    var self=this;
                    self.publish("scrollStart");
                    ul.stop().animate(moveObj, animate,this.options.scrollEasing,function() {
                        self.publish("scrollEnd");
                    });
                } else {
                    ul.stop().css(moveObj);
                }
            }
            
        },
        
        /**
	     * Sets the currently focused list element
		 * @function
		 * @param {Integer} index Focused list element index, starting from zero
		 */
        focusIndex: function(index)
        {

            if (index !== null)
            this.publish("beforeFocusItem",[this.data[index],index]);
            
            $("#" + this.htmlId + " .focused").removeClass("focused");

            this.focusedIndex = index;

            if (!this.isLoading && index !== null)
            this.app.tree.moveTo("focus", this.treeRoot + this.data[this.focusedIndex].id);

            try {
                if (this.options.autoScroll) {
                    this.autoScroll();
                }
            } catch(e) {
                console.log(e);
            }
            if (index !== null)
            $("#" + this.htmlId + '_' + index).addClass("focused");
            
            if (index !== null)
            this.publish("afterFocusItem",[this.data[index],index]);

        }
    });

})(Joshlib, jQuery, _);