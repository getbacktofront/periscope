import $ from 'jquery/dist/jquery';
import {Socket} from './lib/socket';
import components from './components/index';

// Open connection to server
var connection = new Socket($('.status'));
connection.connect();

// Load components
components(connection);
