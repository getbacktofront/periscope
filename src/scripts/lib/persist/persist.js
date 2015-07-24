import q from 'Q';

/** A base class for handling persistence with objects */
export class Persist {

  constructor() {
    this.indexes = [];
  }

  /**
   * Create a new instance
   * @return A promise for a new instance.
   */
  insert() {
    var instance = this._new();
    var rtn = this._persist(instance);
    return rtn;
  }

  /**
   * Save an updated instance
   * @return A promise for when the persist is completed.
   */
  update() {
  }

  /**
   * Find and return a single instance by query
   * The handler is in the form:
   *
   *    (v, next, end) => { .... }
   *
   * After processing a value, it must call either next() or end().
   * For short count call end(). Handler calls are dispatched synchronously
   * and the cursor is only incremented when next() is invoked.
   *
   * @param query The query to use to find the object.
   * @param handler Null for a single query, or a value for multiple.
   * @return A promise for a value or count
   */
  find(query, handler) {

    // Multiple mode, stop when asked or out of content, return a promise(count)
    if (handler) {
      return this._find(query, handler);
    }

    // Single mode, stop after one item, return a promise(v)
    var deferred = q.defer();
    this._find(query, (v, next, end) => {
      end();
      deferred.resolve(v);
    }).then(null, () => {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  /**
   * Run a find() query and return a promise for all records.
   * @param query The query to use to find the object.
   * @return A promise for all values
   */
  all(query) {
    var deferred = q.defer();
    var rtn = [];
    this.find(query, (v, next, end) => {
      rtn.push(v);
      next();
    }).then(() => {
      deferred.resolve(rtn);
    });
    return deferred.promise;
  }

  /**
   * Return an index by name
   * @param name The name of the index
   * @return An index instance or null
   */
  index(name) {
    return this.indexes[name] ? this.indexes[name] : null;
  }

  /** Implement this in the final child factory to create new instances of the required type */
  _new() {
    throw new Error('Not implemented');
  }

  /** Implement this in the persistence backend to persist and object into the storage */
  _persist(instance) {
    throw new Error('Not implemented');
  }

  /**
   * Implement this in the persistence backend to return results async as per find().
   * @param query Some query structure
   * @param handler Invoke this handler for each item. (value, next, end) => { ... }
   * @return A promise for the count of returned items.
   */
  _find(query, handler) {
    throw new Error('Not implemented');
  }
}
