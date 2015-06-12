var $ = require('../../node_modules/jquery/dist/jquery');
var SockJS = require('../../node_modules/sockjs-client/lib/entry');

/** Possible connection states */
var ConnectionState = {
  CLOSED: 'socket--closed',
  CONNECTING: 'socket--connecting',
  CONNECTED: 'socket--connected'
};

/** Client socket connection handler */
class Connection {

  /** Create a new connection helper */
  constructor($status) {
    this.socket = null;
    this.path = '/service';
    this.$status = $status;
  }

  /**
   * Update the connection state
   * @param state A ConnectionState value.
   */
  state(state) {
    if (this.$status != null) {
      this.$status.html(state);
    }
    $('body').removeClass(ConnectionState.CLOSED);
    $('body').removeClass(ConnectionState.CONNECTING);
    $('body').removeClass(ConnectionState.CONNECTED);
    $('body').addClass(state);
    console.log(state);
  }

  /** Open a connection, or at least attempt to... */
  connect() {
    this.state(ConnectionState.CONNECTING);
    var socket = new SockJS(this.path);
    var router = require('./router');
    socket.onopen = () => {
      this.state(ConnectionState.CONNECTED);
      this.socket = socket;
    };
    socket.onclose = () => {
      this.state(ConnectionState.CLOSED);
      this.socket = null;
    };
    socket.onmessage = (e) => {
      try {
        var data = e.data;
        data = JSON.parse(data);
        console.log(data);
        router.handle(data, socket);
      }
      catch(err) {
        console.log("Invalid socket message");
        console.log(err);
      }
    };
  }
}

// Export only the connection handler
module.exports = Connection;
