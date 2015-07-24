export default function(handler) {
  var services = [
    require('./task'),
    require('./periscope')
  ];
  for (var i = 0; i < services.length; ++i) {
    var service = services[i]();
    console.log("Binding service: " + service.path);
    handler.bind(service);
  }
};
