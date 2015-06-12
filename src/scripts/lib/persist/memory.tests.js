var MemoryFactory = require('./memory.js');

class Foo {
}

class FooFactory extends MemoryFactory {
  _new() {
    return new Foo();
  }
}

module.exports.test_create_object = function(test) {
  var factory = new FooFactory();
  var instance = factory.insert();
  test.ok(instance);
  test.done();
};
