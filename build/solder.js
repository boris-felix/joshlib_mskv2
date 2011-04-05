/*global exports: true */
/*jslint onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, newcap: true, immed: true */


var path      = require('path');


exports.config = {

  compressors: {
    css: [ {
        name   : 'scss',
        options: {
          bin:["/usr/bin/sass","/home/node/.gem/ruby/1.8/bin/sass", "/home/joshfire/.gem/ruby/1.9.1/bin/sass"]
        }
    }/*,{
      name   : 'yui',
      options: {
        jar: __dirname+'/yuicompressor-2.4.2.jar'
      }
    }*/],

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
        //"js/libs/jquery.ui.slider.js",
        //"js/libs/jquery.flash.js",
        //"js/libs/jquery.cookie.js"
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
         "js/libs/jquery-1.5.1.js"/*,
         "js/libs/jquery.inherit-1.3.2.M.js"*/
      ]
    },
    
    'historyjs-jquery': {
      requires: [ ],
      css: [],
      js: [
        "js/libs/historyjs/history.adapter.jquery.js",
         "js/libs/historyjs/history.js",
         "js/libs/historyjs/history.html4.js"
      ]
    },
    
    'mediaelement': {
        css:[
            //"css/mediaelement/mediaelementplayer.scss"
           // "css/mediaelement/mejs-skins.css"
        ],
        js:[
            "js/libs/mediaelement.js"/*,
            "js/libs/mediaelementplayer.js"*/
        ]
    },
    
    'joshlib-bootstrap-jquery':{
        requires: ["jquery","underscore"],
        css: [],
        js: [
            'js/josh/main.js',
            
            'js/josh/main_jquery.js',
            
            'js/josh/inheritance.js',
            'js/josh/pubsub.js',
            
            'js/josh/uielement.js'
        ]   
    },
    
    'joshlib-bootstrap-sencha':{
        requires: ["sencha-touch","underscore"],
        css: [],
        js: [
            'js/josh/main.js',
            'js/josh/main_ext.js',
            
            'js/josh/inheritance.js',
            'js/josh/pubsub.js',
            
            'js/josh/uielement.js',
            'js/josh/uielement_sencha.js'
            
        ]   
    },
    
    
    'joshlib': {
      requires: [],
      css: [],
      js: [

        'js/josh/utils/grid.js',
        'js/josh/utils/delayedswitch.js',
        'js/josh/utils/pool.js',
        'js/josh/utils/datasource.js',
        'js/josh/utils/datasource.jquery.js',
        
        
        
        
        'js/josh/app.js',
        'js/josh/tree.js',        
        'js/josh/input.js',
        'js/josh/inputs/keyboard.js',
        'js/josh/inputs/mouse.js',
        
        'js/josh/uielements/panel/base.js',
        'js/josh/uielements/list/base.js',
        'js/josh/uielements/list/multiselect.js',
        'js/josh/uielements/video/base.js',
        
        'js/josh/utils/stress.js'
      ]
    },
    
    'joshlib-web': {
      requires: ["joshlib-bootstrap-jquery","joshlib","mediaelement"],
      css: [
       // 'css/style.css'
      ],
      js: [
        'js/josh/uielements/video/mediaelement.js',
        'js/josh/uielements/mediacontrols/base.js',
        
        
        'js/josh/targets/web/general.js'
      ]
    },
    'joshlib-web-youtube': {
      requires: ["joshlib-bootstrap-jquery","joshlib"],
      css: [
      //  'css/style.css'
      ],
      js: [
        'js/libs/swfobject-2.2.js',
        'js/josh/uielements/video/youtube.js',
        'js/josh/uielements/mediacontrols/base.js',
        
        'js/josh/targets/web/general.js'
      ]
    },    
    'joshlib-googletv': {
      requires: ["joshlib-bootstrap-jquery","joshlib","mediaelement"],
      css: [
      //  'css/style.css',
      //    'css/targets/googletv.scss'
      ],
      js: [
        'js/josh/uielements/video/mediaelement.js',
        'js/josh/uielements/mediacontrols/base.js',
        
        'js/josh/targets/10feet/googletv.js'
      ]
    },
    'joshlib-googletv-youtube': {
      requires: ["joshlib-bootstrap-jquery","joshlib"],
      css: [
      //  'css/style.css',
    //    'css/targets/googletv.scss'
      ],
      js: [
        'js/libs/swfobject-2.2.js',
        'js/josh/uielements/video/youtube.js',
        'js/josh/uielements/mediacontrols/base.js',
        
        'js/josh/targets/10feet/googletv.js'
      ]
    },    
    
    'joshlib-kinectdemo': {
      requires: ["joshlib-bootstrap-jquery","joshlib","mediaelement"],
      css: [
      //  'css/style.css',
      // 'css/targets/googletv.scss'
      ],
      js: [
        'js/josh/inputs/kinect.js',
        'js/josh/uielements/video/mediaelement.js',
        'js/josh/uielements/mediacontrols/base.js',
        
        'js/josh/targets/10feet/kinectdemo.js'
      ]
    },
    
    'joshlib-iphone': {
      requires: ["joshlib-bootstrap-sencha","joshlib"],
      css: [
        "css/sencha-touch/apple.css"
      ],
      js: [
      
          'js/josh/uielement_sencha.js',
          'js/josh/uielements/panel/sencha.js',
          'js/josh/uielements/list/sencha.js',
          'js/josh/uielements/video/popup.js',
          'js/josh/uielements/video/sencha_youtube.js',
          
          'js/josh/targets/smartphones/sencha.js'
      ]
    },
    
    
    
    
    
    
    
    
    'joshlib-node':{
        requires: ["underscore"],
        css: [],
        js: [
            'js/josh/main.js',
            'js/josh/main_node.js',
            
            'js/josh/inheritance.js',
            'js/josh/pubsub.js',
            
            'js/josh/utils/grid.js',
            'js/josh/utils/delayedswitch.js',
            'js/josh/utils/pool.js',
            'js/josh/utils/datasource.js',
            'js/josh/utils/datasource.node.js',
       
            'js/josh/app.js',
            'js/josh/tree.js',        
            'js/josh/input.js'
      ]
    },
    
    
    

    
  }
  
};

