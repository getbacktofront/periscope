import q from 'Q';
import {PersistenceFactory} from './persist';

/** Stores object instances in memory */
export class MemoryFactory extends PersistenceFactory {

  constructor() {
    super();
    this._storage = {};
  }

  /** Generate a random id for this node */
  _random() {
    return Math.floor(Math.random() * 1000000);
  }

  /** Generate a new id and save by the new id if it has none */
  _persist(instance) {
    var deferred = q.defer();
    if (!instance.id) {
      instance.id = this._random();
    }
    this._storage[instance.id] = instance;
    deferred.resolve(instance);
    return deferred.promise;
  }

  /**
   * Accept queries for id: 'value', or ids: ['value1', 'value2']
   * @param query Some query structure
   * @param handler Invoke this handler for each item. (value, next, end) => { ... }
   * @return A promise for the count of returned items.
   */
  _find(query, handler) {
    var rtn = q.defer();

    // Get list of ids and query helper
    var ids = query.ids ? query.ids.slice(0) : [];
    if (query.id) { ids.push(query.id); }
    var match = (value) => {
      for (var i = 0; i < ids.length; ++i) {
        if (ids[i] == value.id) {
          return true;
        }
      }
      return false;
    };

    // Cache active list for this query
    var values = [];
    for (var key in this._storage) {
      if (match(this._storage[key])) {
        values.push(this._storage[key]);
      }
    }
    if (values.length == 0) {
      rtn.resolve(0);
      return rtn.promise;
    }

    // Invoke this handler to generate the next in the event chain
    var offset = 0;
    var dispatch_next = () => {
      if (offset < values.length) {
        try {
          handler(values[offset], () => {
            offset += 1;
            dispatch_next();
          }, () => {
            rtn.resolve(offset + 1);
          });
        }
        catch(err) {
          console.log(err);
        }
      }
      else {
        rtn.resolve(offset);
      }
    };

    // Async resolve
    setTimeout(dispatch_next, 0);
    return rtn.promise;
  }
}
