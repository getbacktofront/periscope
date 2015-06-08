var Service = require('../lib/service.js');
var $ = require('../../../node_modules/jquery/dist/jquery');
module.exports = function() {
  return new Service('task', (data, c, next) => {
    console.log("TASK found...");
    console.log(data);
    $('#output').val(data.value);
    next();
  });
};
