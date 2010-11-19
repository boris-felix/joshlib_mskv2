var g = require('../../garcon/lib/garcon.js'),
    server, myApp;
    
// create a server which will listen on port 8000 by default
server = new g.Server({port:8889});

// adding an application named 'myapp' tells the server to respond to
// the /myapp url and to create a myapp.html file when saving
myApp = server.addApp({
  name: 'joshlib',
  buildVersion:"HEAD"
});

var files = {
    "js/libs/jquery":[
        "js/libs/jquery-1.4.4.js",
        "js/libs/jquery.inherit-1.3.2.M.js",
        "js/libs/jquery.ui.slider.js",
        "js/libs/jquery.flash.js",
        
        
    ],
    "js/libs/sencha-touch":[
           "js/libs/sencha-touch-debug.js",
           "js/libs/jquery-1.4.4.js",
           "js/libs/jquery.inherit-1.3.2.M.js"
    ],
    
    "js/josh":[
          'js/josh/main.js',
          'js/josh/app.js',
          'js/josh/menu.js',
          'js/josh/api.js',
          'js/josh/ui.js',
          'js/josh/control.js',
          'js/josh/controls/keyboard.js',
		  'js/josh/controls/mouse.js',
          'js/josh/uielements/panel.js',
          'js/josh/uielements/list/all.js'
    ],
    
    "js/josh/targets/10feet/googletv":[
        'js/josh/targets/10feet/googletv.js',
        'js/josh/uielements/video/flarevideo.js'
    ],
    
    "js/josh/targets/smartphones/iphone":[
        'js/josh/targets/smartphones/main.js',
        'js/josh/uielements/list/smartphones.js',
        'js/josh/uielements/video/smartphones.js'
    ],
    
    "js/josh/targets/smartphones/android":[
        'js/josh/targets/smartphones/main.js',
        'js/josh/uielements/list/smartphones.js',
        'js/josh/uielements/video/smartphones.js'
    ]
    
    
}


// add other dependencies
myApp.addFrameworks(
  
  { path:'css/googletv',files:[
        'css/style.css',
        'css/flarevideo/flarevideo.css',
        'css/flarevideo/flarevideo.vimeo.scss'
    ], combineStylesheets: true },
  { path:'css/iphone',files:["css/sencha-touch/apple.css"], combineStylesheets: true },
  { path:'css/android',files:['css/sencha-touch/android.css'], combineStylesheets: true },
  
  { path:'js/libs/modernizr',files:["js/libs/modernizr-1.6.min.js"], combineScripts: true },
  
  { path:'js/josh/targets/10feet/googletv',files:[].concat(
      files['js/libs/jquery'],
      files['js/josh'],
      files['js/josh/targets/10feet/googletv']
     ), combineScripts: true },
  
  { path:'js/josh/targets/smartphones/iphone',files:[].concat(
      files['js/libs/sencha-touch'],
      files['js/josh'],
      files['js/josh/targets/smartphones/iphone']
     ), combineScripts: true }
  
);


// build the app
myApp.build(function() {
  
  // run the server
  server.run();
  
});

