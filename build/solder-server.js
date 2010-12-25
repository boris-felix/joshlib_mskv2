
var express = require('express'),
    connect = require('connect'),
    path = require('path');
    
var    request = require('request'),
    solder = require(path.normalize(__dirname+'../../../solder/lib/solder.js')),
    spawn = require('child_process').spawn;

var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
//    app.set('views', __dirname + '/views');
    
    app.use(connect.logger({ format : ":method :url"}));
    //app.use(connect.bodyDecoder());
    //app.use(connect.methodOverride());
    app.use(app.router);
    
    app.use(connect.staticProvider({ root: path.normalize(__dirname + '/../'), cache: false }));
    app.use(connect.staticProvider({ root: path.normalize(__dirname + '/../public'), cache: false }));
    
    solder.expressRoute(app, {
        configFile:path.normalize(__dirname+"/../build/solder.js")
    });
    
});


app.listen(3000);
console.log('Solder Joshlib running at http://localhost:3000/');