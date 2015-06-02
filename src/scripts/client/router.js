var ServiceHandler = require('./lib/service_handler.js');
var Service = require('./lib/service.js');

var instance = new ServiceHandler();
var service1 = new Service('/foo', (data, next) => {
  console.log("Foo");
  next();
});
var service2 = new Service('/bar', (data, next) => {
  console.log("Bar");
  next();
});
var service3 = new Service('.*', (data, next) => {
  console.log("ALL");
  next();
});

instance.bind(service1);
instance.bind(service2);
instance.bind(service3);

module.exports = instance;
