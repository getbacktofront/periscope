var q = require('q');

/** Possible states the service can be in */
var ServiceState = {
  IDLE: 0,
  OK: 1,
  ERROR: 2
};

/** A service that can handle some kind of task */
class Service {

  /**
   * Create an instance and associate some regex with it
   * @param path The incoming path regex, eg. foo.*
   * @param handler The handler to invoke when something happens.
   */
  constructor(path, handler) {
    this.state = ServiceState.IDLE;
    this.path = new RegExp(path);
    this.handler = handler;
    this.error = null;
  }

  /** Check if this service matches the given regex */
  matches(path) {
    return this.path.test(path);
  }

  /** Query for current state: IDLE; ie. didn't run */
  isIdle() {
    return this.state == ServiceState.IDLE;
  }

  /** Query for current state: SUCCESS; ie. ran and was ok */
  isOk() {
    return this.state == ServiceState.OK;
  }

  /** Query for current state: FAILED; ie. ran and failed */
  isError() {
    return this.state == ServiceState.ERROR;
  }

  /**
   * Process this service and set the response state
   * @param data The data object, anything, so long as it has a 'path' property.
   * @param conn The connection object, whatever it is.
   */
  handle(data, conn) {
    this.state = ServiceState.IDLE;
    var deferred = q.defer();
    deferred.promise.then((value) => {
      this.state = value === false ? ServiceState.IDLE : ServiceState.OK;
    }, (err) => {
      this.state = ServiceState.ERROR;
      this.error = err;
    });
    console.log(data);
    console.log(data.path);
    console.log(this.path);
    if (data && data.path) {
      if (this.matches(data.path)) {
        try {
          this.handler(data, conn, (value) => {
            deferred.resolve(value);
          }, (error) => {
            deferred.reject(error);
          });
        }
        catch(err) {
          deferred.reject(err);
        }
      }
      else {
        deferred.resolve(false);
      }
    }
    else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }
}

module.exports = Service;
