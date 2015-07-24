import q from 'Q';

/** A base class for handling object indexes */
export class Index {

  /**
   * Bind this index to a persist instance
   * @param persist The Persist object to associate this index with.
   * @param name The name of this index.
   * @return A promise for completion.
   */
  bind(persist, name) {
    throw new Error('Not implemented');
  }

  /**
   * Insert a record / key binding for this index
   * @param key The cache key value
   * @return A promise for completion
   */
  index(value) {
    throw new Error('Not implemented');
  }

  /**
   * Return a count of the values in this index
   * @return A promise for the count
   */
  count() {
    throw new Error('Not implemented');
  }

  /**
   * Return count query values offset from the start.
   * @param offset The offset into the index key set.
   * @param count The number of index keys to return
   * @return A promise for an array of index values
   */
  keys(offset, count) {
    throw new Error('Not implemented');
  }

  /**
   * Return a query value for the given key set
   * @param keys The set of keys to generate a query for
   * @return The query object for the set of keys
   */
  query(keys) {
    throw new Error('Not implemented');
  }

  /**
   * Return a paged lookup of key values.
   * The return value is in the form:
   *
   *    {'page': 0, 'page_size': 10, 'pages': 2, keys: [....], last: true, first, false}
   *
   * @param offset The page offset
   * @param size The size of the page
   * @return A promise for a page of key values
   */
  page(offset, size) {
    var rtn = q.defer();
    this.count().then((count) => {
      var pages = Math.ceil(count / size);
      var page = offset;
      if (page < 0) {
        page = 0;
      }
      if (page > pages) {
        page = pages;
      }
      var min = page * size;
      if ((min + size) > (count - 1)) {
        size = (count - min);
      }
      this.keys(min, size).then((keys) => {
        rtn.resolve({
          page: page,
          page_size: size,
          pages: pages,
          keys: keys,
          first: page == 0,
          last: page == (pages - 1)
        });
      }, () => {
        rtn.resolve('Unable to resolve key values');
      });
    }, () => {
      rtn.resolve('Unable to count records');
    });
    return rtn.promise;
  }
}
