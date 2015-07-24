import ServiceHandler from './service_handler';
import Service from './service';
import services_factory from '../services/index';

// Create a new handler and pass
var instance = new ServiceHandler();
services_factory(instance);
module.exports = instance;
