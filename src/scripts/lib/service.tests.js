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
  var instance = new Service('foo.*', (service, next) => {
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
  var instance = new Service('foo.*', (service, next) => {
    next();
  });
  test.ok(instance.isIdle());
  instance.handle({ path: 'bar' }).then(() => {
    console.log("MISSING RESOLVED with OK?");
    console.log(instance);
    test.ok(instance.isIdle());
    console.log("compelted");
    test.done();
  }, () => {
    test.ok(false);
  });
};

module.exports.test_service_handle_failure = function(test) {
  console.log("test_service_handle_failure");
  test.expect(2);
  var instance = new Service('foo.*', (service) => {
    throw new Error("Failed");
  });
  test.ok(instance.isIdle());
  instance.handle({ path: 'fooooo' }).then(() => {
    test.ok(false);
  }, (err) => {
    console.log("...?");
    console.log(err);
    console.log(instance);
    test.ok(instance.isError());
    test.done();
  });
};
