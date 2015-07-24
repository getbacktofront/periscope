var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var express = require('express');

var app = express();
app.use('/', express.static(__dirname + '/../../public'));

var router = null;
var server = app.listen(3000, function() {
  console.log("Express server running");
  router = require('./router');
});

// 1. Echo sockjs server
var socket_server = sockjs.createServer({});
socket_server.on('connection', function(conn) {
  conn.on('data', function(message) {
    if (router != null) {
      try {
        var data = JSON.parse(message);
        router.handle(data, conn);
      }
      catch(err) {
        console.log(err);
      }
    }
  });
});

socket_server.installHandlers(server, {prefix:'/service'});

module.exports = server;
