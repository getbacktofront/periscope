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
   * @param conn The connection object, whatever type.
   */
  handle(data, conn) {
    var promises = [];
    for (var i = 0; i < this.bindings.length; ++i) {
      console.log("passing conn" + conn);
      var p = this.bindings[i].handle(data, conn);
      promises.push(p);
    }
    return q.all(promises);
  }
}

module.exports = ServiceHandler;
