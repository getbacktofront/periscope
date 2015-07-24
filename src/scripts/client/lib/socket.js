import $ from 'jquery/dist/jquery';
import SockJS from 'sockjs-client/lib/entry';
import q from 'Q';

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
    this.reconnect = true;
    this.interval = false;
    this.reconnect_interval = 3000;
  }

  /**
   * Update the connection state
   * @param state A SocketState value.
   */
  state(state) {
    $('body').removeClass(SocketState.CLOSED);
    $('body').removeClass(SocketState.CONNECTING);
    $('body').removeClass(SocketState.CONNECTED);
    $('body').addClass(state);
  }

  /** Open a connection, or at least attempt to... */
  connect() {
    this.state(SocketState.CONNECTING);
    var deferred = q.defer();
    var socket = new SockJS(this.path);
    var router = require('./router');
    socket.onopen = () => {
      this.state(SocketState.CONNECTED);
      this.socket = socket;
      deferred.resolve(true);
    };
    socket.onclose = () => {
      setTimeout(() => {
        this.state(SocketState.CLOSED);
        this.socket = null;
        if (this.reconnect) {
          setTimeout(() => {
            this.connect();
          }, this.reconnect_interval);
        }
      }, 1000);
    };
    socket.onmessage = (e) => {
      try {
        var data = e.data;
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        router.handle(data, socket);
      }
      catch(err) {
        console.log("Invalid socket message");
        console.log(err);
      }
    };
    return deferred.promise;
  }
}
