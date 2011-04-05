
// Backbone.Controller
// -------------------

// Controllers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
Backbone.Controller = function(options) {
  options || (options = {});
  if (options.routes) this.routes = options.routes;
  this._bindRoutes();
  this.initialize(options);
};

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var namedParam = /:([\w\d]+)/g;
var splatParam = /\*([\w\d]+)/g;

// Set up all inheritable **Backbone.Controller** properties and methods.
_.extend(Backbone.Controller.prototype, Backbone.Events, {

  // Initialize is an empty function by default. Override it with your own
  // initialization logic.
  initialize : function(){},

  // Manually bind a single named route to a callback. For example:
  //
  //     this.route('search/:query/p:num', 'search', function(query, num) {
  //       ...
  //     });
  //
  route : function(route, name, callback) {
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    Backbone.history.route(route, _.bind(function(fragment) {
      var args = this._extractParameters(route, fragment);
      callback.apply(this, args);
      this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
  },

  // Simple proxy to `Backbone.history` to save a fragment into the history,
  // without triggering routes.
  saveLocation : function(fragment) {
    Backbone.history.saveLocation(fragment);
  },

  // Bind all defined routes to `Backbone.history`.
  _bindRoutes : function() {
    if (!this.routes) return;
    for (var route in this.routes) {
      var name = this.routes[route];
      this.route(route, name, this[name]);
    }
  },

  // Convert a route string into a regular expression, suitable for matching
  // against the current location fragment.
  _routeToRegExp : function(route) {
    route = route.replace(namedParam, "([^\/]*)").replace(splatParam, "(.*?)");
    return new RegExp('^' + route + '$');
  },

  // Given a route, and a URL fragment that it matches, return the array of
  // extracted parameters.
  _extractParameters : function(route, fragment) {
    return route.exec(fragment).slice(1);
  }

});

// Backbone.History
// ----------------

// Handles cross-browser history management, based on URL hashes. If the
// browser does not support `onhashchange`, falls back to polling.
Backbone.History = function() {
  this.handlers = [];
  this.fragment = this.getFragment();
  _.bindAll(this, 'checkUrl');
};

// Cached regex for cleaning hashes.
var hashStrip = /^#*/;

// Set up all inheritable **Backbone.History** properties and methods.
_.extend(Backbone.History.prototype, {

  // The default interval to poll for hash changes, if necessary, is
  // twenty times a second.
  interval: 50,

  // Get the cross-browser normalized URL fragment.
  getFragment : function(loc) {
    return (loc || window.location).hash.replace(hashStrip, '');
  },

  // Start the hash change handling, returning `true` if the current URL matches
  // an existing route, and `false` otherwise.
  start : function() {
    var docMode = document.documentMode;
    var oldIE = ($.browser.msie && (!docMode || docMode <= 7));
    if (oldIE) {
      this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
    }
    if ('onhashchange' in window && !oldIE) {
      $(window).bind('hashchange', this.checkUrl);
    } else {
      setInterval(this.checkUrl, this.interval);
    }
    return this.loadUrl();
  },

  // Add a route to be tested when the hash changes. Routes are matched in the
  // order they are added.
  route : function(route, callback) {
    this.handlers.push({route : route, callback : callback});
  },

  // Checks the current URL to see if it has changed, and if it has,
  // calls `loadUrl`, normalizing across the hidden iframe.
  checkUrl : function() {
    var current = this.getFragment();
    if (current == this.fragment && this.iframe) {
      current = this.getFragment(this.iframe.location);
    }
    if (current == this.fragment ||
        current == decodeURIComponent(this.fragment)) return false;
    if (this.iframe) {
      window.location.hash = this.iframe.location.hash = current;
    }
    this.loadUrl();
  },

  // Attempt to load the current URL fragment. If a route succeeds with a
  // match, returns `true`. If no defined routes matches the fragment,
  // returns `false`.
  loadUrl : function() {
    var fragment = this.fragment = this.getFragment();
    var matched = _.any(this.handlers, function(handler) {
      if (handler.route.test(fragment)) {
        handler.callback(fragment);
        return true;
      }
    });
    return matched;
  },

  // Save a fragment into the hash history. You are responsible for properly
  // URL-encoding the fragment in advance. This does not trigger
  // a `hashchange` event.
  saveLocation : function(fragment) {
    fragment = (fragment || '').replace(hashStrip, '');
    if (this.fragment == fragment) return;
    window.location.hash = this.fragment = fragment;
    if (this.iframe && (fragment != this.getFragment(this.iframe.location))) {
      this.iframe.document.open().close();
      this.iframe.location.hash = fragment;
    }
  }

});

// Backbone.View
// -------------

// Creating a Backbone.View creates its initial element outside of the DOM,
// if an existing element is not provided...
Backbone.View = function(options) {
  this._configure(options || {});
  this._ensureElement();
  this.delegateEvents();
  this.initialize(options);
};

// Element lookup, scoped to DOM elements within the current view.
// This should be prefered to global lookups, if you're dealing with
// a specific view.
var selectorDelegate = function(selector) {
  return $(selector, this.el);
};

// Cached regex to split keys for `delegate`.
var eventSplitter = /^(\w+)\s*(.*)$/;

// Set up all inheritable **Backbone.View** properties and methods.
_.extend(Backbone.View.prototype, Backbone.Events, {

  // The default `tagName` of a View's element is `"div"`.
  tagName : 'div',

  // Attach the `selectorDelegate` function as the `$` property.
  $       : selectorDelegate,

  // Initialize is an empty function by default. Override it with your own
  // initialization logic.
  initialize : function(){},

  // **render** is the core function that your view should override, in order
  // to populate its element (`this.el`), with the appropriate HTML. The
  // convention is for **render** to always return `this`.
  render : function() {
    return this;
  },

  // Remove this view from the DOM. Note that the view isn't present in the
  // DOM by default, so calling this method may be a no-op.
  remove : function() {
    $(this.el).remove();
    return this;
  },

  // For small amounts of DOM Elements, where a full-blown template isn't
  // needed, use **make** to manufacture elements, one at a time.
  //
  //     var el = this.make('li', {'class': 'row'}, this.model.get('title'));
  //
  make : function(tagName, attributes, content) {
    var el = document.createElement(tagName);
    if (attributes) $(el).attr(attributes);
    if (content) $(el).html(content);
    return el;
  },

  // Set callbacks, where `this.callbacks` is a hash of
  //
  // *{"event selector": "callback"}*
  //
  //     {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save'
  //     }
  //
  // pairs. Callbacks will be bound to the view, with `this` set properly.
  // Uses event delegation for efficiency.
  // Omitting the selector binds the event to `this.el`.
  // This only works for delegate-able events: not `focus`, `blur`, and
  // not `change`, `submit`, and `reset` in Internet Explorer.
  delegateEvents : function(events) {
    if (!(events || (events = this.events))) return;
    $(this.el).unbind();
    for (var key in events) {
      var methodName = events[key];
      var match = key.match(eventSplitter);
      var eventName = match[1], selector = match[2];
      var method = _.bind(this[methodName], this);
      if (selector === '') {
        $(this.el).bind(eventName, method);
      } else {
        $(this.el).delegate(selector, eventName, method);
      }
    }
  },

  // Performs the initial configuration of a View with a set of options.
  // Keys with special meaning *(model, collection, id, className)*, are
  // attached directly to the view.
  _configure : function(options) {
    if (this.options) options = _.extend({}, this.options, options);
    if (options.model)      this.model      = options.model;
    if (options.collection) this.collection = options.collection;
    if (options.el)         this.el         = options.el;
    if (options.id)         this.id         = options.id;
    if (options.className)  this.className  = options.className;
    if (options.tagName)    this.tagName    = options.tagName;
    this.options = options;
  },

  // Ensure that the View has a DOM element to render into.
  _ensureElement : function() {
    if (this.el) return;
    var attrs = {};
    if (this.id) attrs.id = this.id;
    if (this.className) attrs["class"] = this.className;
    this.el = this.make(this.tagName, attrs);
  }

});