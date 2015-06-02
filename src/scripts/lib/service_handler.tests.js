var ServiceHandler = require('./service_handler.js');
var Service = require('./service.js');

module.exports.test_create_service = function(test) {
  var instance = new ServiceHandler();
  test.ok(instance);
  test.done();
}

module.exports.test_bind_and_trigger = function(test) {
  test.expect(3);

  var instance = new ServiceHandler();
  var service1 = new Service('/foo', (data, next) => { next(); });
  var service2 = new Service('/bar', (data, next) => { next(); });
  var service3 = new Service('.*', (data, next) => { next(); });

  instance.bind(service1);
  instance.bind(service2);
  instance.bind(service3);

  instance.handle({ path: '/foo' }).then(() => {
    console.log("Foo and so then");
    test.ok(service1.isOk());
    test.ok(service2.isIdle());
    test.ok(service3.isOk());
    test.done();
  });
}
