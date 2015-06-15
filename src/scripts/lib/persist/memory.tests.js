import q from 'Q';
import {MemoryFactory} from './memory';

class Foo {
}

class FooFactory extends MemoryFactory {
  _new() {
    return new Foo();
  }
}

module.exports.test_create_object = function(test) {
  test.expect(1);
  var factory = new FooFactory();
  factory.insert().then((instance) => {
    test.ok(instance);
    test.done();
  }, () => {
    test.ok(false, 'Unreachable');
  })
};

module.exports.test_find_single_object = function(test) {
  test.expect(1);
  var factory = new FooFactory();
  factory.insert().then((instance) => {
    var promise = factory.find({id: instance.id}).then((v, next) => {
      console.log("Find invoked");
      test.ok(v.id == instance.id);
      test.done();
      next();
    }, () => { test.ok(false, 'Unreachable'); })
  });
};

module.exports.test_find_all_objects = function(test) {
  test.expect(1);
  var factory = new FooFactory();
  var inserts = [];
  var all_ids = [];
  for (var i = 0; i < 10; ++i) {
    inserts.push(factory.insert().then((v) => {
      console.log("SAVED ID TO LIST ---> " + v.id);
      all_ids.push(v.id);
    }));
  }
  q.all(inserts).then(() => {
    factory.find({ids: all_ids}, (v, next, end) => {
      console.log(v);
      next();
    }).then((count) => {
      console.log("Final count was: " + count);
      test.ok(count == 10);
      test.done();
    }, () => {
      test.ok(false, 'Unreachable');
    });
  }, () => {
    tests.ok(false, 'Unreachable');
  });
};

module.exports.test_find_some_objects = function(test) {
  test.expect(1);
  var found = 0;
  var factory = new FooFactory();
  var inserts = [];
  var all_ids = [];
  for (var i = 0; i < 10; ++i) {
    inserts.push(factory.insert().then((v) => {
      console.log("SAVED ID TO LIST ---> " + v.id);
      all_ids.push(v.id);
    }));
  }
  q.all(inserts).then(() => {
    factory.find({ids: all_ids}, (v, next, end) => {
      console.log(v);
      found += 1;
      var _ = (found == 5) ? end() : next();
    }).then((count) => {
      console.log("Final count was: " + count);
      test.ok(count == 5);
      test.done();
    }, () => {
      test.ok(false, 'Unreachable');
    });
  }, () => {
    tests.ok(false, 'Unreachable');
  });
};
