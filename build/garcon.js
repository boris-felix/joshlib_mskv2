var g = require('../../garcon/lib/garçon'),
    server, myApp;
    
// create a server which will listen on port 8000 by default
server = new g.Server({port:8889});

// adding an application named 'myapp' tells the server to respond to
// the /myapp url and to create a myapp.html file when saving
myApp = server.addApp({
  name: 'joshlib',
  buildVersion:"HEAD"
});

// myApp needs SproutCore to run
//myApp.addSproutcore();


var jsFiles = {
    "js/libs/jquery":[
        "js/libs/jquery-1.4.4.js",
        "js/libs/jquery.inherit-1.3.2.M.js"
    ],
    "js/josh":[
          'js/josh/main.js',
          'js/josh/app.js',
          'js/josh/menu.js',
          'js/josh/ui.js',
          'js/josh/uielements/video.js',
          'js/josh/uielements/panel.js',
          'js/josh/uielements/list.js'
    ]
    
}


// add other dependencies
myApp.addFrameworks(
  
  // a third party framework
  // { path: 'frameworks/calendar' },
  //{ path:'js/libs/jquery',files:jsFiles['js/libs/jquery'], combineScripts: true },
  
  { path:'js/josh',files:jsFiles['js/libs/jquery'].concat(jsFiles['js/josh']), combineScripts: true }
);


// build the app
myApp.build(function() {
  
  // run the server
  server.run();
  
});

