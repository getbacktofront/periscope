import $ from 'jquery/dist/jquery';
import jade from 'jade/runtime';
import menu from 'component-corner-menu/dist/component';

// Re-export component
export default function factory(connection) {
  menu($, jade);
  return { name: 'CornerMenu' };
}
