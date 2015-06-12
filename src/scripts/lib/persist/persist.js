import q from 'Q';

/** A base class for handling persistence with objects */
export default class PersistenceFactory {

  /** Create a new instance */
  insert() {
    var instance = this._new();
    this._persist(instance);
    return instance;
  }

  /** Save an updated instance */
  update() {
  }

  /**
   * Find and return a single instance by query
   * @param query The query to use to find the object.
   * @param handler Null for a single query, or a value for multiple.
   * @return A promise for a value or count
   */
  select(query, handler) {

    // Multiple mode, stop when asked or out of content, return a promise(count)
    if (!handler) {
      return this._find(query, handler);
    }

    // Single mode, stop after one item, return a promise(v)
    var deferred = q.defer();
    this._find(query, 1, (v, end) => {
      end();
      deferred.resolve(v);
    }).then(null, () => {
      deferred.reject(err);
    });
    return deferred.promise;
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
   * Implement this in the persistence backend to return results async.
   * @param query Some query structure
   * @param handler Invoke this handler for each item. (value, stop) => { ... }
   * @return A promise for the count of returned items.
   */
  _find(query, handler) {
    throw new Error('Not implemented');
  }
}
