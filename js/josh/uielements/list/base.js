(function(J, $) {

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
        HtmlTag: 'ul ',
        // style="display:none;"
        defaultOptions: {
            //where is the tree unfolding to
            "orientation": "up",
            "persistFocus": true,
            "autoScroll": false,
            "browsingSense": 'locale',
            "itemTemplate": function(self, htmlId, data)
            {
                return "<li id='" + htmlId + "' data-path='" + self.treeRoot + data.id + "' class='joshover'><img src='" + data["image"] + "' /><br/>" + data["label"] + "</li>";
            },
            "loadingTemplate": function(self) {
                return "<li class='loading'>Loading...</li>";
            }
        },

        init: function() {
            this.isLoading = true;
            this.focusedIndex = null;
            this.data = [];
            this.id2index = {};

            var self = this;
            this.grid = new J.Utils.Grid({
                "grid": [
                []
                ],
                "dimensions": 2,
                "onChange": function(coords, elem) {
                    console.log("onChange", coords, elem);
                    self.focusIndex(coords[0]);
                },
                "onExit": function(side) {
                    //go to leaf
                    console.log("onExit", side);
                    if (side[1] > 0) {
                        self.app.publish("stateGo", ["focus", "down"], true);


                        //go to parent
                    } else if (side[1] < 0) {
                        if (self.treeRoot == '/') return false;

                        self.app.publish("stateGo", ["focus", "up"], true);

                    }
                },
                "orientation": this.options.orientation
            });
        },

        insert: function() {
            this.__base();
        },

        getHtmlOpeningTag: function()
        {
            return '<' + this.HtmlTag + ' id="' + this.htmlId + '" style="display:none">';
        },

        getHtmlClosingTag: function()
        {
            return '</' + this.HtmlTag.split(/\s/, 2)[0] + '>';
        },

        getHtmlInner: function()
        {
            if (this.isLoading)
            {
                if (typeof this.options["loadingTemplate"] == "function") {
                    return this.options["loadingTemplate"](this);
                } else {
                    return this.options["loadingTemplate"];
                }

            } else {
                var ret = [];
                for (var i = 0; i < this.data.length; i++)
                {
                    ret.push(this.options["itemTemplate"](this, this.htmlId + "_" + i, this.data[i]));
                }
                return ret.join("");
            }
        },

        getHtml: function()
        {
            return this.getHtmlOpeningTag() + this.getHtmlInner() + this.getHtmlClosingTag();
        },

        setTreeRoot: function(treeRoot) {
            this.__base(treeRoot.replace(/\/[^\/]*$/, "/"));
        },


        subscribes: function() {

            var self = this;
            return this.__base().concat([
            ["input",
            function(ev, data) {
                //only supports orientation=="up" for now
                var sens = data[0];

                /// rtl langages for arabic, hebrew, hindi and japanese
                if ((self.options.browsingSense == 'locale') && (document.dir == 'rtl'))
                {
                    switch (sens)
                    {
                    case 'left':
                        sens = 'right';
                        break;
                    case 'right':
                        sens = 'left';
                        break;
                    }
                }
                console.log("receiveControl", self.id, data);


                if (sens == "hover") {
                    var split = data[1].split("/");
                    var lastPath = split[split.length - 1];
                    if (data[1].indexOf(self.treeRoot) === 0) {
                        var subPath = data[1].substring(self.treeRoot.length);
                        if (subPath.indexOf("/") === -1) {
                            if (self.id2index[subPath] !== undefined) {
                                self.grid.goTo([self.id2index[subPath], 0]);
                            }
                        }
                    }

                } else if (sens == "left" || sens == "right" || sens == "down" || sens == "up") {
                    if (!self.hasFocus) return false;
                    self.grid.go(sens);

                } else if (sens == "enter") {

                    var dest = false;

                    if (data[1]) {
                        var split = data[1].split("/");
                        var lastPath = split[split.length - 1];
                        if (data[1].indexOf(self.treeRoot) === 0) {
                            var subPath = data[1].substring(self.treeRoot.length);
                            if (subPath.indexOf("/") === -1) {
                                if (self.id2index[subPath] !== undefined) {
                                    dest = self.treeRoot + self.data[self.id2index[subPath]]["id"];
                                }
                            }
                        }
                        if (!dest) {
                            return;
                        }
                    } else {
                        if (!self.hasFocus && !data[1]) return false;

                        if (self.isLoading) return false;

                        dest = self.treeRoot + self.data[self.focusedIndex]["id"];
                    }

                    self.event('onPanelActing');

                    self.app.publish("stateGoTo", ["current", dest]);

                    self.event('onPanelActed');

                }


            }]
            ]);
        },

        refresh: function() {
            this.__base();
            //console.log("REF",this.id,this.focusedIndex);
            if (this.options["persistFocus"] && this.focusedIndex !== null) {
                $("#" + this.htmlId + '_' + this.focusedIndex).addClass("focused");
            }
        },

        setLoading: function(isLoading) {
            this.isLoading = isLoading;
        },

        setData: function(data) {
            this.__base(data);

            //todo: do this in tree
            for (var i = 0; i < data.length; i++) {
                this.id2index[data[i].id] = i;
            }

            this.grid.setGrid([data]);

            //this.grid.currentCoords=false;
        },
        /*
        onBlur:function(path) {
            this.grid.currentCoords=false;
            this.__base(path);
        },
		*/
        onFocus: function(path)
        {

            if (path.charAt(path.length - 1) == "/") {
                this.grid.goTo([0, 0]);
            } else {
                var id = path.split("/").pop();
                var index = this.id2index[id];
                this.grid.goTo([index, 0]);
            }


            this.__base(path);
        },

        resetIndex: function() {
            this.focusIndex(null);
            this.grid.currentCoords = false;
        },

        autoScroll: function() {

            var that = this;

            if (that.data[that.focusedIndex] !== undefined)
            {

                var container = that.app.baseHtml;
                if (that.options.orientation == "up" || that.options.orientation == "down") {
                    var totalPixels = $(container).width();
                }

                var elt = $('#' + that.htmlId + '_' + that.focusedIndex);

                var safetyMargin = 100;
                var animate = true;

                if (elt.length !== 0)
                {
                    var left = elt.offset().left - container.offset().left;
                    var width = elt.width();

                    var list = $('#' + that.htmlId);

                    var prop = "left";

                    if (document.dir == 'rtl') {
                        prop = "right";
                        left = totalPixels - left - width;
                    }

                    var moveObj = {};

                    if (left < 0 + safetyMargin) {
                        moveObj[prop] = Math.min(0, width - left);
                    } else if (left + width > totalPixels - safetyMargin) {
                        moveObj[prop] = width - left;
                    }

                    if (animate) {
                        list.stop().animate(moveObj, 200);
                    } else {
                        list.stop().css(moveObj);
                    }
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
            console.log(this.id, "F", index);

            $("#" + this.htmlId + " .focused").removeClass("focused");

            this.focusedIndex = index;

            if (!this.isLoading && index !== null)
            this.app.publish("stateGoTo", ["focus", this.treeRoot + this.data[this.focusedIndex].id], true);

            try {
                if (this.options.autoScroll)
                this.autoScroll();
            } catch(e) {
                console.log(e);
            }
            if (index !== null)
            $("#" + this.htmlId + '_' + index).addClass("focused");

        }
    });


})(Joshlib, jQuery);