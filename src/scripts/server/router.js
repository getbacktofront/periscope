var ServiceHandler = require('./lib/service_handler.js');
var Service = require('./lib/service.js');
var services_factory = require('./services/index.js');

// Create a new handler and pass
var instance = new ServiceHandler();
services_factory(instance);
module.exports = instance;
