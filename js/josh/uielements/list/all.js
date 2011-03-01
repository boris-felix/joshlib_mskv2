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

        setLoading: function() {
            //console.log("LOAD",this.id);
            this.isLoading = true;
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

                    if (left < 0 + safetyMargin) 
						{
							moveObj[prop] = Math.min(0, width - left);
							// ajout debug
							// alert(moveObj[prop] + "-" + "Passage 1");  // <==============================
							// end
						}
					else if (left + width > totalPixels - safetyMargin) {
                        moveObj[prop] = width - left;
						// ajout debug
						// alert(moveObj[prop] + "-" + "Passage 2"); // <================================
						// end
						
						// alert(prop);
						
						if(moveObj[prop] == -1095 && prop == "right")
							{
								// alert('right - ' + prop);
							}
						else if(moveObj[prop] == -1095 && prop == "left")
							{
								// alert('left - ' + prop);
							}
						else if(moveObj[prop] == -614)
							{
								moveObj[prop] = -2190;
							}
						else if(moveObj[prop] == -957)
							{
								moveObj[prop] = -3285;
							}
						else if(moveObj[prop] == -721)
							{
								moveObj[prop] = -4380;
							}
						else if(moveObj[prop] == -1140)
							{
								moveObj[prop] = -5475;
/*-------------------*/		}// RETOUR -----------------------------------------------------------
						else if(moveObj[prop] == -4855)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -4676)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -4218)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -4179)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -4006)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -3762)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -3642)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -3414)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -3147)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -3144)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -2720)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -2373)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -2156)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -2084)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -1709)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -1776)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -1583)
							{
								moveObj[prop] = -0;
							}
						else if(moveObj[prop] == -1283)
							{
								moveObj[prop] = -0;
							}
						
						// alert(prop);
						
						/*
						else if(prop = "left")
							{
								// alert('je passe | left');
								moveObj[prop] = 0;
							}
						else if(prop = "right")
							{
								// alert('je passe | right');
								moveObj[prop] *= -1;
								if (animate) {
									list.stop().animate(moveObj, 200);
								} else {
									list.stop().css(moveObj);
								}
							}*/
						
							
						/*if (Math.abs(moveObj[prop]) < 800 && Math.abs(moveObj[prop]) > 1){
							if(moveObj[prop] < 0)
								moveObj[prop] *= -1;
							moveObj[prop] += 1500;
							
							if(moveObj[prop] < 1600){
								moveObj[prop] += 500;
								var pas = true;
							}
							
							moveObj[prop] *= -1;
							
							if(pas){
								moveObj[prop] *= -1;
								moveObj[prop] += 600;
								moveObj[prop] *= -1;
								// alert('passe');
							}
							
						}
						
						if(moveObj[prop] == -1000 ||
							moveObj[prop] == -2245){
								moveObj[prop] -= 2500;
								// alert('passe2');
							}
						
						if(moveObj[prop] == -762 || 
							moveObj[prop] == -1762 || 
							moveObj[prop] == -793 ||
							moveObj[prop] == -1793 ||
							moveObj[prop] == -679 ||
							moveObj[prop] == -1679 ||
							moveObj[prop] == -991 ||
							moveObj[prop] == -1033)
							{
								moveObj[prop] -= 2300;
							}
						
						if(moveObj[prop] == -1146 || 
							moveObj[prop] == -876)
							moveObj[prop] -= 3700;
						
						if(moveObj[prop] <= -5100)
							moveObj[prop] = 0;
						else if(moveObj[prop] == -4855 ||
							moveObj[prop] == -4876 ||
							moveObj[prop] == -4179 ||
							moveObj[prop] <= -4800 ||
							moveObj[prop] == -4676 ||
							moveObj[prop] == -4218 ||
							moveObj[prop] == -4006 ||
							moveObj[prop] == -3762 ||
							moveObj[prop] == -3642 ||
							moveObj[prop] == -3414 ||
							moveObj[prop] == -3147 ||
							moveObj[prop] == -3144 ||
							moveObj[prop] == -2373 ||
							moveObj[prop] == -3091){
							// alert("passe3");
							moveObj[prop] = Math.floor(moveObj[prop]/5);
							// alert(moveObj[prop]);
						}					
						
						if(moveObj[prop] == -4705)
							moveObj[prop] = Math.floor(-moveObj[prop]/5);
						
						if(moveObj[prop] == -1054 ||
							moveObj[prop] == -1024 ||
							moveObj[prop] == -1096 ||
							moveObj[prop] == -1130 ||
							moveObj[prop] == -1092 ||
							moveObj[prop] == -1083 ||
							moveObj[prop] == -1067 ||
							moveObj[prop] == -1174){
							moveObj[prop] -= 4500;
						}
						
						if(moveObj[prop] == -846)
							moveObj[prop] -= 3500;
							
						if(moveObj[prop] == -341.8 ||
							moveObj[prop] == -628 ||
							moveObj[prop] == -2084 ||
							moveObj[prop] == -2720 ||
							moveObj[prop] == -1776 ||
							moveObj[prop] == -801 ||
							moveObj[prop] == -1120 ||
							moveObj[prop] == -2603 ||
							moveObj[prop] == -682 ||
							moveObj[prop] == -317 ||
							moveObj[prop] == -629 ||
							moveObj[prop] == -803 ||
							moveObj[prop] == -971 ||
							moveObj[prop] == -802)
							moveObj[prop] += 1000;
						
						// alert(moveObj[prop]);
						
						if(moveObj[prop] == -3091 || 
							moveObj[prop] == -3464 ||
							moveObj[prop] == -4709 ||
							moveObj[prop] == -3960 ||
							moveObj[prop] == -729 ||
							moveObj[prop] == -683 ||
							moveObj[prop] == -630 ||
							moveObj[prop] == -4703 ||
							moveObj[prop] == -1876 ||
							moveObj[prop] == -1393 ||
							moveObj[prop] == -1296)
							moveObj[prop] = 0;
							
						if (moveObj[prop] == -1293)
							{
								moveObj[prop] *= -1;
								moveObj[prop] -= 1000; 
							}
						
						if(moveObj[prop] == -1583)
							{
								moveObj[prop] = 3;
								// alert(moveObj[prop]);
							}
						
						
						if(moveObj[prop] == -1095 && typeof(maVariable)=='undefined')
							{
								var maVariable = true; // -1095 a déjà été executé une fois
								// il faut trouvé un moyen d'indiquer "2 ème fois, t'es égale à 0"
							}
						else if(moveObj[prop] == -1095 && typeof(maVariable)==true)
							{
								moveObj[prop] = 0;
							}
							*/
						/*
						else if (Math.abs(moveObj[prop]) < 1510 && Math.abs(moveObj[prop]) >= 800){
							if(moveObj[prop] < 0)
								moveObj[prop] *= -1;
							moveObj[prop] += 1000;
							moveObj[prop] *= -1;
							
						}
						
						*/
						
						// ajout debug
						// alert(moveObj[prop] + "-" + "Passage 2.1"); // <===============================
						// end

					}
					// ajout ligne
					/*if (moveObj[prop] < 1900){
						moveObj[prop] *= 1;
					}
					else if (moveObj[prop] > 1900){
						moveObj[prop] *= -1
					}
					
					if (Math.abs(moveObj[prop]) < 800 && Math.abs(moveObj[prop]) > 10){
						moveObj[prop] += 600
						moveObj[prop] *= -1;
					}*/
					// end						
					
					// ajout debug
					// alert(moveObj[prop] + "-" + "Passage 3"); // <======================================
					// end
			

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