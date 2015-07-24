import q from 'Q';
import {Memory} from './memory';

class Foo {
  constructor() {
    this.foo = 'foo';
  }
}

class FooFactory extends Memory {
  _new() {
    return new Foo();
  }
}

export function test_create_object(test) {
  test.expect(1);
  var factory = new FooFactory();
  factory.insert().then((instance) => {
    test.ok(instance);
    test.done();
  }, () => {
    test.ok(false, 'Unreachable');
  })
};

export function test_find_single_object(test) {
  test.expect(1);
  var factory = new FooFactory();
  factory.insert().then((instance) => {
    var promise = factory.find({id: instance.id}).then((v) => {
      test.ok(v.id == instance.id);
      test.done();
    }, () => { test.ok(false, 'Unreachable'); })
  });
};

export function test_find_all_objects(test) {
  test.expect(1);
  var factory = new FooFactory();
  var inserts = [];
  var all_ids = [];
  for (var i = 0; i < 10; ++i) {
    inserts.push(factory.insert().then((v) => {
      all_ids.push(v.id);
    }));
  }
  q.all(inserts).then(() => {
    factory.find({ids: all_ids}, (v, next, end) => {
      next();
    }).then((count) => {
      test.ok(count == 10);
      test.done();
    }, () => {
      test.ok(false, 'Unreachable');
    });
  }, () => {
    tests.ok(false, 'Unreachable');
  });
};

export function test_find_some_objects(test) {
  test.expect(1);
  var found = 0;
  var factory = new FooFactory();
  var inserts = [];
  var all_ids = [];
  for (var i = 0; i < 10; ++i) {
    inserts.push(factory.insert().then((v) => {
      all_ids.push(v.id);
    }));
  }
  q.all(inserts).then(() => {
    factory.find({ids: all_ids}, (v, next, end) => {
      found += 1;
      var _ = (found == 5) ? end() : next();
    }).then((count) => {
      test.ok(count == 5);
      test.done();
    }, () => {
      test.ok(false, 'Unreachable');
    });
  }, () => {
    tests.ok(false, 'Unreachable');
  });
};
