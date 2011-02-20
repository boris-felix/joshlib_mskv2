/*global exports: true */
/*jslint onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, newcap: true, immed: true */


var path      = require('path');

exports.config = {

  compressors: {
    css: [ {
        name   : 'scss',
        options: {
          bin:"/usr/bin/sass"
        }
    },{
      name   : 'yui',
      options: {
        jar: __dirname+'/yuicompressor-2.4.2.jar'
      }
    }],

    js: [{
      name   : 'yui',
      options: {
        jar: __dirname+'/yuicompressor-2.4.2.jar'
      }
    }]

    // js: {
    //   name   : 'closure',
    //   options: {
    //     jar: '/Users/brett/Library/Java/Extensions/compiler.jar'
    //   }
    // }
  },

  // List of local paths to search (in order) for CSS and JS files referenced
  // by components.
  sourcePaths: [
    path.normalize(__dirname + '/../')
  ],

  // A component is a group of CSS and/or JS files. Individual files can be on
  // the local file system or at remote URLs. Components can require other
  // components to create modular dependencies.
  //
  // If you reference remote URLs, Solder will attempt to cache them according
  // to any HTTP cache headers.
  components: {

    'modernizr': {
      requires: [ ],
      css: [],
      js: [
        "js/libs/modernizr-1.6.min.js"
      ]
    },

    'jquery': {
      requires: [ ],
      css: [],
      js: [
        "js/libs/jquery-1.4.4.js",
        "js/libs/jquery.inherit-1.3.2.M.js",
        "js/libs/jquery.ui.slider.js",
        "js/libs/jquery.flash.js",
        "js/libs/jquery.cookie.js"
      ]
    },
    
    'underscore': {
      requires: [ ],
      css: [],
      js: [
        "js/libs/underscore.js"
      ]
    },
    
    'sencha-touch': {
      requires: [ ],
      css: [],
      js: [
        "js/libs/sencha-touch-debug.js",
         "js/libs/jquery-1.4.4.js",
         "js/libs/jquery.inherit-1.3.2.M.js"
      ]
    },
    
    'mediaelement': {
        css:[
            "css/mediaelement/mediaelementplayer.scss"
           // "css/mediaelement/mejs-skins.css"
        ],
        js:[
            "js/libs/mediaelement.js"/*,
            "js/libs/mediaelementplayer.js"*/
        ]
    },
    
    
    'joshlib': {
      requires: ["jquery","underscore"],
      css: [],
      js: [
        'js/josh/main.js',
        
        'js/josh/utils/grid.js',
        'js/josh/utils/delayedswitch.js',
        'js/josh/utils/pool.js',
        'js/josh/utils/datasource.js',
        
        'js/josh/app.js',
        'js/josh/tree.js',        
        'js/josh/input.js',
        'js/josh/inputs/keyboard.js',
        'js/josh/inputs/mouse.js',
        'js/josh/uielement.js',
        'js/josh/uielements/panel.js',
        'js/josh/uielements/list/all.js',
        'js/josh/uielements/list/check-list.js',
        'js/josh/uielements/video/all.js',
        
        'js/josh/utils/stress.js'
      ]
    },
    'joshlib-web': {
      requires: ["joshlib","mediaelement"],
      css: [
        'css/style.css'
      ],
      js: [
        'js/josh/uielements/video/mediaelement.js',
        'js/josh/targets/web/general.js'
      ]
    },
    
    'joshlib-googletv': {
      requires: ["joshlib","mediaelement"],
      css: [
        'css/style.css',
        'css/targets/googletv.scss'
      ],
      js: [
        'js/josh/uielements/video/mediaelement.js',
        
        
        'js/josh/targets/10feet/googletv.js'
      ]
    },
    
    'joshlib-kinectdemo': {
      requires: ["joshlib","mediaelement"],
      css: [
        'css/style.css',
        'css/targets/googletv.scss'
      ],
      js: [
        'js/josh/inputs/kinect.js',
        'js/josh/uielements/video/mediaelement.js',
        
        'js/josh/targets/10feet/kinectdemo.js'
      ]
    },
    
    'joshlib-iphone': {
      requires: ["joshlib"],
      css: [
        "css/sencha-touch/apple.css"
      ],
      js: [

          'js/josh/uielements/list/sencha.js',
          'js/josh/uielements/video/popup.js',
          
          'js/josh/targets/smartphones/main.js'
      ]
    }

    
  }
  
};

