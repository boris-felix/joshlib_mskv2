(function(J, $) {

    J.UIElementBase = J.Class(

    /**
            @lends J.UIElement.prototype
        */
    {

        baseDefaultOptions: {
            hideDelay: 0,
            autoInsert: true,
            showOnFocus: true,
            showOnPreFocus: true,
            hideOnBlur: true,
            show:function(that) {
                $("#" + that.htmlId).css({
                    "opacity": 1
                }).show();
            },
            hide:function(that) {
                $("#" + that.htmlId).hide();
            }
        },

        /**
		    @constructs
		    @class An abstract UI Element
		    @param {J.App} app Reference to the app object
		    @param {String} id unique identifier
		    @options {Object} Hash of options
		*/
        __constructor: function(app, id, options) {

            this.app = app;
            this.id = id;
            this.options = {};
            J.extend(this.options, this.baseDefaultOptions, this.defaultOptions, options || {});
            this.htmlId = this.getHtmlId();
            this.children = [];
            this._subscribed = [];
            this.hasFocus = false;
            this.inserted = false;

            this.nextShowHide = false;
            
            var self = this;
            this.showHideSwitch = new J.Utils.DelayedSwitch(function() {
                self.processShowHide();
            },
            null, this.options.hideDelay);

            this.treeRoot = false;
            this.treeCurrent = false;

            // Bind event handlers present in the options
            _.each(this.options,function(handler,k) {
                if (k.substring(0,2)=="on" && typeof handler=="function") {
                    var evtName = k.charAt(2).toLowerCase()+k.substring(3);
                    self.subscribe(evtName,function(ev,data) {
                        handler(self,ev,data);
                    });
                }
            });


            // Forward global events to local listeners when focus is on us
            this.app.subscribe("input",function(ev, data) {
                //console.log("Element "+self.id+" catched input event, forwarding to local: ",ev,data,self.hasFocus);
                if (!self.hasFocus) return;
                self.publish(ev,data);
            });

            //Listen for any new treeData
            if (this.options.treeRoot) {

                this.app.subscribe("treeDataLoading",function(ev, data) {

                    //console.log("LOADING",self.id,self.treeRoot,data[0])
                    //This treeData is about us!
                    if (self.treeRoot == data[0]) {
                        self.setLoading(true);
                        self.refresh();
                    }
                });

                this.app.subscribe("treeData",function(ev, data) {
                    
                    //This treeData is about us!
                    if (self.treeRoot == data[0]) {
                        self.setData(data[1]);
                        self.refresh();
                    }
                });

                this.app.subscribe("stateChange",function(ev, data) {
                    var path = data[1];
                    var register = data[0];

                    //This treeData is about us!
                    if (self.options.treeRoot == path || (typeof self.options.treeRoot != "string" && self.options.treeRoot.test(path))) {

                        if (register == "focus" || register == "prefocus") {

                            self.setTreeRoot(path);

                            var mdata = self.app.tree.getData(self.treeRoot);
                            
                            console.log("m "+register, mdata, self.treeRoot);
                            
                            if (mdata) {
                                if (mdata == "loading") {
                                    self.setLoading(true);
                                    self.refresh();
                                } else if (!self.data) {
                                    self.setData(mdata);
                                    self.refresh();
                                }

                            }
                            
                            if (register=="prefocus") {
                                if (self.options.showOnPreFocus === true) {
                                    self.show();
                                }
                            } else if (register=="focus") {
                                self.focus(path);
                            }

                        } else if (register == "current") {
                            self.setTreeCurrent(path);
                        }

                        //Was a focus on another element: blur us
                    } else if (register == "focus" && self.hasFocus) {
                        self.blur(path);
                    }
                });
            }



            this.init();
        },

        init: function() {

        },

        /**
		 * Sets the tree root associated with the element
		 * @function
		 * @param {String} treeRoot Tree path
		 */
        setTreeRoot: function(treeRoot) {
            if (this.treeRoot != treeRoot) {
                this.treeRoot = treeRoot;
                this.data = false;
            }
        },

        /**
		 * Sets the current tree path associated with the element
		 * @function
		 * @param {String} treeCurrent Tree path
		 */
        setTreeCurrent: function(treeCurrent) {
            this.treeCurrent = treeCurrent;
        },

        /**
		 * Puts the element in loading mode
		 * @function
		 * @param {Boolean} is Loading
		 */
        setLoading: function(isLoading) {

            if (isLoading) {
                $("#" + this.htmlId).html("Loading...");
            }
        },

        /**
		 * Registers one element as a child
		 * @function
		 * @param {J.UIElement} elt The child element
		 */
        registerChild: function(elt) {
            this.children.push(elt);
        },

        /**
		 * focus
		 * @function
		 * @param {String} treePath Path of the focused element in the tree
		 */
        focus: function(treePath) {

            this.publish('beforeFocus');
            
            if (!this.hasFocus)
            {

                if (this.options.showOnFocus === true)
                {
                    this.show();
                }

            }
            this.hasFocus = true;
            this.publish('afterFocus');
        },

        /**
		 * blur
		 * @function
		 */
        blur: function() {
            console.log("onBlur", this.id, this.options.persistFocus);

            this.publish("beforeBlur");

            if (this.options.hideOnBlur === true) {
                this.hideDelayed();
            }

            if (!this.options.persistFocus) {
                $("#" + this.htmlId + " .focused").removeClass("focused");
            }

            this.hasFocus = false;

            this.publish("afterBlur");
        },

        /**
		 * Refresh data in the UIElement
		 * @function
		 * @param {Function} callback callback when refreshed
		 */
        refresh: function(callback)
        {

            if ($("#" + this.htmlId).length === 0)
            {
                if (this.options.autoInsert === true)
                {
                    this.insert();
                }
            } else {
                $("#" + this.htmlId).html(this.getHtmlInner());
            }

            this.publish("afterRefresh");
            
            if (typeof callback === 'function') {
                callback();
            }
        },

        /**
		 * Show the element right away
		 * @function
		 */
        show: function() {
            this.publish("beforeShow");
            this.options.show(this);
            this.publish("afterShow");
            this.showHideSwitch.off();
        },

        /**
		 * Hide the element right away
		 * @function
		 */
        hide: function() {
            this.publish("beforeHide");
            this.options.hide(this);
            this.publish("afterHide");
            this.showHideSwitch.off();
        },

        processShowHide: function() {
            if (this.nextShowHide == "show") {
                this.show();
            } else {
                this.hide();
            }
        },

        /**
		 * Show the element, possibly with a delay
		 * @function
		 */
        showDelayed: function() {
            this.nextShowHide = "show";
            this.showHideSwitch.reset();
        },

        /**
		 * Hide the element, possibly with a delay
		 * @function
		 */
        hideDelayed: function() {
            this.nextShowHide = "hide";
            this.showHideSwitch.reset();
        },

        /**
		 * Insert the element in the DOM
		 * @function
		 */
        insert: function() {
            var parent;
            if (this.options.parent) {
                parent = $("#" + this.options.parent.htmlId);
            } else {
                parent = this.app.baseHtml;
            }

            parent.append(this.getHtml());
            this.inserted = true;
            if (this.options.autoShow) {
                this.show();
            }

            this.publish('afterInsert');
            
            // Insert children elements that have the autoInsert flag
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].options.autoInsert) {
                    this.children[i].insert();
                }
            }
        },

        /**
		 * Gets the actual DOM ElementId of the UIElement
		 * @returns {String} ElementId
		 */
        getHtmlId: function() {
            return this.app.id + "_e_" + this.id;
        },
        
        getHtml:function() {
            return "<div id='" + this.htmlId + "'>"+this.getHtmlInner()+"</div>";
        },
        
        getHtmlInner:function() {
            return "";
        },

        /**
		 * Sets the data for the UIElement
		 * @param data Data
		 */
        setData: function(data) {
            this.data = data;
            this.setLoading(false);
        }

    });
    
    J.extend(J.UIElementBase.prototype,J.PubSub);

    J.UIElement = J.UIElementBase;

    /**
        @namespace Namespace for UIElements
    */
    J.UI = {};



})(Joshlib, jQuery);
