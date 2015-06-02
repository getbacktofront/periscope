var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var express = require('express');

var app = express();
app.use('/', express.static(__dirname + '/../../public'));

var server = app.listen(3000, function() {
  console.log("Express server running");
});

// 1. Echo sockjs server
var sockjs_echo = sockjs.createServer({});
sockjs_echo.on('connection', function(conn) {
  console.log("Got an incoming web socket connection");
    conn.on('data', function(message) {
        var data = {
          path: '/foo',
          msg: message + '____'
        };
        console.log(data);
        conn.write(JSON.stringify( data ));
    });
});

/*server.addListener('upgrade', function(req,res){
    res.end();
});*/

sockjs_echo.installHandlers(server, {prefix:'/echo'});

module.exports = server;
