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
    var promise = factory.find({id: instance.id}).then((v, next) => {
      test.ok(v.id == instance.id);
      test.done();
      next();
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

export function test_index_exists(test) {
  var factory = new FooFactory();
  test.ok(factory.index('key'));
  test.done();
};

export function test_pagination_works(test) {
  test.expect(15);
  var found = 0;

  // Insert a bunch of records
  var factory = new FooFactory();
  var inserts = [];
  for (var i = 0; i < 25; ++i) {
    inserts.push(factory.insert());
  }

  // Now look for a couple of pages
  q.all(inserts).then(() => {
    factory.index('key').page(0, 10).then((value) => {
      test.ok(value.keys.length == 10);
      test.ok(value.page == 0);
      test.ok(value.page_size == 10);
      test.ok(value.first == true);
      test.ok(value.last == false);
      factory.index('key').page(1, 10).then((value) => {
        test.ok(value.keys.length == 10);
        test.ok(value.page == 1);
        test.ok(value.page_size == 10);
        test.ok(value.first == false);
        test.ok(value.last == false);
        factory.index('key').page(2, 10).then((value) => {
          test.ok(value.keys.length == 5);
          test.ok(value.page == 2);
          test.ok(value.page_size == 5);
          test.ok(value.first == false);
          test.ok(value.last == true);
          test.done();
        });
      });
    });
  });
};

export function test_index_query(test) {
  test.expect(11);
  var found = 0;

  // Insert a bunch of records
  var factory = new FooFactory();
  var inserts = [];
  for (var i = 0; i < 25; ++i) {
    inserts.push(factory.insert());
  }

  // Now resolve index keys to values
  q.all(inserts).then(() => {
    factory.index('key').page(0, 10).then((value) => {
      var query = factory.indexes.keys.query(value.keys);
      factory.find(query,  (v, next, end) => {
        test.ok(v.foo == 'foo');
        next();
      }).then((count) => {
        test.ok(count == 10);
        test.done();
      });
    });
  });
}

export function test_index_query(test) {
  test.expect(11);
  var found = 0;

  // Insert a bunch of records
  var factory = new FooFactory();
  var inserts = [];
  for (var i = 0; i < 25; ++i) {
    inserts.push(factory.insert());
  }

  // Now resolve index keys to values
  q.all(inserts).then(() => {
    factory.indexes.key.page(0, 10).then((value) => {
      var query = factory.indexes.keys.query(value.keys);
      factory.all(query).then((records) => {
        test.ok(records.length == 10);
        for (var j = 0; j < 10; ++j) {
          test.ok(records[j].foo == 'foo');
        }
        test.done();
      });
    });
  });
}
