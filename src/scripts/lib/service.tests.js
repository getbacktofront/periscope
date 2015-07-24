var Service = require('./service.js');

module.exports.test_create_service = function(test) {
  var instance = new Service('foo');
  test.ok(instance);
  test.done();
};

module.exports.test_service_matches = function(test) {
  var instance = new Service('foo.*');
  test.ok(instance.matches('foo'));
  test.ok(instance.matches('foooooo'));
  test.ok(!instance.matches('bar'));
  test.done();
};

module.exports.test_service_handle = function(test) {
  test.expect(2);
  var instance = new Service('foo.*', (service, c, next) => {
    next();
  });
  test.ok(instance.isIdle());
  instance.handle({ path: 'foo' }).then(() => {
    test.ok(instance.isOk());
    test.done();
  }, () => {
    test.ok(false);
  });
};

module.exports.test_service_handle_miss = function(test) {
  test.expect(2);
  var instance = new Service('foo.*', (service, c, next) => {
    next();
  });
  test.ok(instance.isIdle());
  instance.handle({ path: 'bar' }).then(() => {
    test.ok(instance.isIdle());
    test.done();
  }, () => {
    test.ok(false);
  });
};

module.exports.test_service_handle_failure = function(test) {
  test.expect(2);
  var instance = new Service('foo.*', (service) => {
    throw new Error("Failed");
  });
  test.ok(instance.isIdle());
  instance.handle({ path: 'fooooo' }).then(() => {
    test.ok(false);
  }, (err) => {
    test.ok(instance.isError());
    test.done();
  });
};

class CustomService extends Service {
  handler(data, conn, next) {
    this.data = data;
    this.next = next;
    switch (data.request) {
      case 'foo': this.handle_foo(); break;
      case 'bar': this.handle_bar(); break;
    }
    this.next();
  }
  handle_foo() {
    this.output = 'foo';
  }
  handle_bar() {
    this.output = 'bar';
  }
}

module.exports.test_extended_service_handle = function(test) {
  test.expect(4);
  var instance = new CustomService('foo.*');
  instance.handle({ path: 'foo', request: 'foo' }).then(() => {
    test.ok(instance.isOk());
    test.ok(instance.output == 'foo');
    instance.handle({ path: 'foo', request: 'bar' }).then(() => {
      test.ok(instance.isOk());
      test.ok(instance.output == 'bar');
      test.done();
    }, (err) => {
      test.ok(false);
    });
  }, (err) => {
    test.ok(false);
  });
};
