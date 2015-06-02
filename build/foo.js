'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var express = require('express');
var thing = require('./lib/thing');

var Foo = (function () {
  function Foo(req, res) {
    _classCallCheck(this, Foo);

    this.req = req;
    this.res = res;
  }

  _createClass(Foo, [{
    key: 'index',
    value: function index() {
      console.log('Request --- ');
      console.log(thing);
      console.log(new thing(100));
      this.res.json({ 'Hello': 'World 10' });
    }
  }], [{
    key: 'dispatch',

    /** Return a dispatch handler */
    value: function dispatch(target, req, res) {
      return function (req, res) {
        new Foo(req, res)[target]();
      };
    }
  }]);

  return Foo;
})();

// Bind urls
var foo = express();
foo.get('/', Foo.dispatch('index'));

// Export app
module.exports.app = foo;