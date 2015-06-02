var q = require('q');

/** A common base for service handlers */
class ServiceHandler {

  /** Create a constructor */
  constructor() {
    this.bindings = [];
  }

  /**
   * Bind a service to this handler
   * @param service The Service instance to bind.
   */
  bind(service) {
    this.bindings.push(service);
  }

  /**
   * Handle some data object
   * @param data Any object with a 'path' property.
   */
  handle(data) {
    var promises = [];
    for (var i = 0; i < this.bindings.length; ++i) {
      var p = this.bindings[i].handle(data);
      promises.push(p);
    }
    return q.all(promises);
  }
}

module.exports = ServiceHandler;
