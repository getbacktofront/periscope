module.exports = function(handler) {
  var services = [
    require('./sass')
  ];
  for (var i = 0; i < services.length; ++i) {
    var service = services[i]();
    console.log("Binding service: " + service.path);
    handler.bind(service);
  }
};
