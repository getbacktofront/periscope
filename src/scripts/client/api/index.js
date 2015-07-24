
export default function apis(connection) {
  var components = [
    require('./pen')
  ];
  for (var i = 0; i < components.length; ++i) {
    var component_factory = components[i](connection);
    console.log("Loaded api: " + component_factory.name);
  }
};
