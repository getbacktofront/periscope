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
var pipe = null;

var connect = function() {

  var sockjs_url = '/service';
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
    pipe = sockjs;

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
    pipe = null;
  };
  sockjs.onmessage = function(e) {
    var data = e.data;
    console.log("Incoming...");
    console.log(data);
    data = JSON.parse(data);
    print('[.] message', data);
    console.log(sockjs);
    router.handle(data, sockjs);
  };
};

var last_value = null;
$('#input').keyup(function() {
  var value = $('#input').val();
  if(last_value != value) {
    if (pipe) {
      pipe.send(JSON.stringify({path: 'sass', raw: value}));
      last_value = value;
    }
  }
});

$status.html('connecting...');
connect();
