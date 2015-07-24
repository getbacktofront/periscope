import polyfill from "babel/polyfill";
import InputBox from './input_box';

module.exports = function(connection) {
  var components = [
    InputBox
  ];
  for (var i = 0; i < components.length; ++i) {
    var component_factory = components[i](connection);
    console.log("Loaded component: " + component_factory.name);
  }
};
