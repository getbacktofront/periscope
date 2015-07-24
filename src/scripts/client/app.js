import $ from 'jquery/dist/jquery';
import {Socket} from './lib/socket';
import components from './components/index';
import api from './api/index';

// Open connection to server
var connection = new Socket($('.status'));

// Load components & apis
components(connection);
api(connection);

// List active pens
connection.connect().then(() => {
  window.periscope.pen.list();
});
