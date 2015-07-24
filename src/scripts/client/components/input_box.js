import $ from 'jquery/dist/jquery';

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
    this.timer = null;
    this.interval = 500;
    this.$input = $input;
    this.output = output;
    this.connection = connection;
    this.service = service;
    $input.keyup(() => { this.reload(); });
  }

  reload() {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      var value = this.$input.val();
      console.log('Value: ' + value);
      if(this.last_value != value) {
        if (this.connection.socket) {
          this.connection.socket.send(
            JSON.stringify({
              path: this.service,
              target: this.output,
              raw: value
            })
          );
          this.last_value = value;
        }
      }
    }, this.interval);
  }
}

// Bind various input handlers
export default function factory(connection) {
  var inputs = [
    new InputBox($('#input'), '#output', connection, 'sass'),
    new InputBox($('#input_jade'), '#output_html', connection, 'jade'),
    new InputBox($('#input_es6'), '#output_js', connection, 'babel')
  ];
  setTimeout(() => {
    for (var i = 0; i < inputs.length; ++i) {
      try {
        inputs[i].reload();
      }
      catch(err) {
        console.log(err);
      }
    }
  }, 500);
  return { name: 'InputBox' };
}
