import q from 'Q';
import {Persist} from './persist';
import {Index} from './index';

/** Stores object instances in memory */
export class Memory extends Persist {

  constructor() {
    super();
    this._storage = {};

    var key_index = new MemoryKeyIndex();
    key_index.bind(this, 'key');
    key_index.bind(this, 'keys');
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
    this.indexes.key.index(instance).then(() => {
      deferred.resolve(instance);
    }, () => {
      deferred.reject("Failed to index new object");
    })
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

/** Stores key values */
export class MemoryKeyIndex extends Index {

  constructor() {
    super();
    this.values = [];
  }

  /**
   * Bind this index to a persist instance
   * @param persist The Persist object to associate this index with.
   * @param name The name of this index.
   * @return A promise for completion.
   */
  bind(persist, name) {
    var rtn = q.defer();
    persist.indexes[name] = this;
    rtn.resolve(true);
    return rtn.promise;
  }

  /**
   * Insert a record / key binding for this index
   * @param value The lookup value for the record
   * @return A promise for completion
   */
  index(value) {
    var rtn = q.defer();
    this.values.push(value.id);
    rtn.resolve(true);
    return rtn.promise;
  }

  /**
   * Return a count of the values in this index
   * @return A promise for the count
   */
  count() {
    var rtn = q.defer();
    rtn.resolve(this.values.length);
    return rtn.promise;
  }

  /**
   * Return count query values offset from the start.
   * @param offset The offset into the index key set.
   * @param count The number of index keys to return
   * @return A promise for an array of index values
   */
  keys(offset, count) {
    var rtn = q.defer();
    rtn.resolve(this.values.slice(offset, offset + count));
    return rtn.promise;
  }

  /**
   * Return a query value for the given key set
   * @param keys The set of keys to generate a query for
   * @return The query object for the set of keys
   */
  query(keys) {
    return { ids: keys };
  }
}
