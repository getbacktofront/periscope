import * as p from '../model/pen';
var pen = new p.Pen();

export default function(handler) {
  var services = [
    require('./sass'),
    require('./jade'),
    require('./babel')
  ];
  for (var i = 0; i < services.length; ++i) {
    var service = services[i](pen);
    console.log("Binding service: " + service.path);
    handler.bind(service);
  }
};
