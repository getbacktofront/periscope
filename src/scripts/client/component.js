require("babel/polyfill");
var $ = require('../../node_modules/jquery/dist/jquery');
var thing = require('./lib/thing');
var Connection = require('./connection');

// Open connection to server
var connection = new Connection($('.status'));
connection.connect();

/** Handle mapping an input area to an output area */
class InputBox {

  /**
   * Create a new input box from dom elements.
   * @param $input The input to watch for key press events.
   * @param output The output selector to publish content to.
   * @param connection To the connection to stream content through.
   * @param service The service to pass this content to.
   */
  constructor($input, output, connection, service) {
    this.last_value = null;
    $input.keyup(() => {
      var value = $input.val();
      if(this.last_value != value) {
        if (connection.socket) {
          connection.socket.send(
            JSON.stringify({
              path: service,
              target: output,
              raw: value
            })
          );
          this.last_value = value;
        }
      }
    });
  }
}

// Bind various input handlers
new InputBox($('#input'), '#output', connection, 'sass');
new InputBox($('#input_jade'), '#output_html', connection, 'jade');
