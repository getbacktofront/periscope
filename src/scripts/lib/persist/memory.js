import q from 'Q';
import PersistenceFactory from './persist';

/** Stores object instances in memory */
class MemoryFactory extends PersistenceFactory {

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
    if (!instance.id) {
      instance.id = this._random();
    }
    this._storage[instance.id] = instance;
  }

  /**
   * Accept queries for id: 'value', or ids: ['value1', 'value2']
   * @param query Some query structure
   * @param handler Invoke this handler for each item. (value, stop) => { ... }
   * @return A promise for the count of returned items.
   */
  _find(query, handler) {
    throw new Error('Not implemented');
  }
}

// Export just the memory factory
module.exports = MemoryFactory;
