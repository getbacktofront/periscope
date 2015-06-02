require("babel/polyfill");
var $ = require('../../node_modules/jquery/dist/jquery');
var SockJS = require('../../node_modules/sockjs-client/lib/entry');
var thing = require('./lib/thing');

class Component {
  constructor(foo) {
    this.foo = foo;
    console.log(new thing(100));
  }
}

var x = new Component();
var $status = $('.status');

var connect = function() {

  var sockjs_url = '/echo';
  var sockjs = new SockJS(sockjs_url);

  var inp  = $('#first input');
  var form = $('#first form');
  var router = require('./router');
  var print = function(m, p) {
      p = (p === undefined) ? '' : JSON.stringify(p);
      console.log(m + ' ' + p);
  };
  sockjs.onopen    = function()  {
    print('[*] open', sockjs.protocol);
    $status.html('open');

    $('#first').show();
    console.log("Opened");
    console.log($('#first'));

    $('form').submit(function(event) {
      console.log("Send: " + inp.val());
      sockjs.send(inp.val());
      event.preventDefault();
      return false;
    });
  };
  sockjs.onclose   = function()  {
    print('[*] close');
    $status.html('closed');
  };
  sockjs.onmessage = function(e) {
    var data = e.data;
    console.log(data);
    data = JSON.parse(data);
    print('[.] message', data);
    router.handle(data);
  };
};

$status.html('connecting...');
connect();
