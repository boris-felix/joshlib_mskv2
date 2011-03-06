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
            this.options = $.extend({}, this.baseDefaultOptions, this.defaultOptions, options || {});
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
                                self.onFocus(path);
                            }

                        } else if (register == "current") {
                            self.setTreeCurrent(path);
                        }

                        //Was a focus on another element: blur us
                    } else if (register == "focus" && self.hasFocus) {
                        self.onBlur(path);
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
		 * Get the list of subscribed events when the element has focus
		 * @function
		 * @return {Array} list of events
		 */
        subscribes: function() {
            return [];
        },


        /**
		 * Calls a custom event handler
		 * @function
		 * @param {String} eventname Name of the event
		 */
        event: function(eventname)
        {
            // détournement d'évènements
            if (typeof this.options[eventname] === 'function')
            {
                return this.options[eventname](
                this,
                // la List en cours
                eventname
                // la clé de l'évènement appelant
                // réfléchir sur la possibilité de proposer en retour d'autres parametres
                );
            }
            return false;
        },

        /**
		 * onFocus
		 * @function
		 * @param {String} treePath Path of the focused element in the tree
		 */
        onFocus: function(treePath) {

            if (!this.hasFocus)
            {
                var self = this;
                this.subscribes().forEach(function(s) {
                    self._subscribed.push(self.app.subscribe(s[0], s[1]));
                });

                if (this.options.showOnFocus === true)
                {
                    this.show();
                }

            }
            this.hasFocus = true;
            this.event('onAfterFocus');
        },

        /**
		 * onBlur
		 * @function
		 */
        onBlur: function() {
            console.log("onBlur", this.id, this.options.persistFocus);

            this.event("onBeforeBlur");

            if (this.options.hideOnBlur === true) {
                this.hideDelayed();
            }

            if (!this.options.persistFocus) {
                $("#" + this.htmlId + " .focused").removeClass("focused");
            }

            this.hasFocus = false;
            var self = this;
            this._subscribed.forEach(function(s) {
                self.app.unsubscribe(s);
            });

            this.event("onAfterBlur");
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

            this.event("onAfterRefresh");
            
            if (typeof callback === 'function') {
                callback();
            }
        },

        /**
		 * Show the element right away
		 * @function
		 */
        show: function() {
            this.event("onBeforeShow");
            this.options.show(this);
            this.event("onAfterShow");
            this.showHideSwitch.off();
        },

        /**
		 * Hide the element right away
		 * @function
		 */
        hide: function() {
            this.event("onBeforeHide");
            this.options.hide(this);
            this.event("onAfterHide");
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

            if (this.options.onAfterInsert) {
                this.options.onAfterInsert(this);
            }

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
            return this.app.id + "_e_" + this.type + "_" + this.id;
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

    J.UIElement = J.UIElementBase;

    /**
        @namespace Namespace for UIElements
    */
    J.UI = {};



})(Joshlib, jQuery);
