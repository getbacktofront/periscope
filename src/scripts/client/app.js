import $ from 'jquery/dist/jquery';
import {Socket} from './lib/socket';
import components from './components/index';
import api from './api/index';

// Open connection to server
var connection = new Socket($('.status'));
connection.connect();

// Load components & apis
components(connection);
api(connection);
