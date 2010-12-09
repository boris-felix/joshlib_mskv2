
//TODO
var server = require('express').createServer();
    path = require('path');
var solder = require(path.normalize(__dirname+'/../../solder/lib/solder.js'));

// Use expressRoute's optional `config` argument to specify a custom URL
// matching regular expression, or to use an existing Solder instance.
//
//    solder.expressRoute(server, {urlPattern: ..., solderer: ...});
//
solder.expressRoute(server,{
    configFile:__dirname+"/solder.js"
});

server.listen(3000);
console.log('Solder Joshlib running at http://localhost:3000/');