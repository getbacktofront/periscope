import $ from 'jquery/dist/jquery';
import SockJS from 'sockjs-client/lib/entry';

/** Possible connection states */
var SocketState = {
  CLOSED: 'socket--closed',
  CONNECTING: 'socket--connecting',
  CONNECTED: 'socket--connected'
};

/** Client socket connection handler */
export class Socket {

  /** Create a new connection helper */
  constructor($status) {
    this.socket = null;
    this.path = '/service';
    this.$status = $status;
  }

  /**
   * Update the connection state
   * @param state A SocketState value.
   */
  state(state) {
    if (this.$status != null) {
      this.$status.html(state);
    }
    $('body').removeClass(SocketState.CLOSED);
    $('body').removeClass(SocketState.CONNECTING);
    $('body').removeClass(SocketState.CONNECTED);
    $('body').addClass(state);
  }

  /** Open a connection, or at least attempt to... */
  connect() {
    this.state(SocketState.CONNECTING);
    var socket = new SockJS(this.path);
    var router = require('./router');
    socket.onopen = () => {
      this.state(SocketState.CONNECTED);
      this.socket = socket;
    };
    socket.onclose = () => {
      this.state(SocketState.CLOSED);
      this.socket = null;
    };
    socket.onmessage = (e) => {
      try {
        var data = e.data;
        data = JSON.parse(data);
        router.handle(data, socket);
      }
      catch(err) {
        console.log("Invalid socket message");
        console.log(err);
      }
    };
  }
}
