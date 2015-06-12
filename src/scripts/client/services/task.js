var Service = require('../lib/service.js');
var $ = require('../../../node_modules/jquery/dist/jquery');

/** Publish the output string to the given target */
module.exports = function() {
  return new Service('task', (data, c, next) => {
    $(data.target).val(data.value);
    next();
  });
};
