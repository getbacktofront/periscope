import {Memory} from '../lib/persist/memory';

/** This class represents a single html/css/javascript combo as a single page */
export class Pen {
  constructor() {
    this.html_src = '#html_input';
    this.html_target = '#html_output';
    this.html_raw = 'div#foo\n  | Hello World';
    this.html = '<div id="foo">Hello World</div>';

    this.js_src = '#js_input';
    this.js_target = '#js_output';
    this.js_raw = 'console.log(document.getElementById("foo"));';
    this.js = 'console.log(document.getElementById("foo"));';

    this.css_src = '#css_input';
    this.css_target = '#css_output';
    this.css_raw = '#foo { border: 1px solid #333; }';
    this.css = '#foo { border: 1px solid #333; }';
  }

  /** Compile into one block of stuff */
  compile() {
    var js = JSON.stringify(this.js);
    var rtn = '<style>'+this.css+'</style>'+this.html+'<script>var script = ' + js + '; try { eval(script); } catch(err) { console.log(err); }</script>';
    console.log(rtn);
    return rtn;
  }

  /** Send various different tasks on the given connection */
  publish(connection, targets) {
    var c = connection;
    for (var i = 0; i < targets.length; ++i) {

      // source values
      switch (targets[i]) {

        // Inputs
        case 'html_src':
          c.write(JSON.stringify({
            path: 'task',
            target: this.html_src,
            value: this.html_raw
          }));
          break;
        case 'js_src':
          c.write(JSON.stringify({
            path: 'task',
            target: this.js_src,
            value: this.js_raw
          }));
          break;
        case 'css_src':
          c.write(JSON.stringify({
            path: 'task',
            target: this.css_src,
            value: this.css_raw
          }));
          break;

        // Outputs
        case 'html':
          c.write(JSON.stringify({
            path: 'task',
            target: this.html_target,
            value: this.html
          }));
          break;
        case 'js':
          c.write(JSON.stringify({
            path: 'task',
            target: this.js_target,
            value: this.js
          }));
          break;
        case 'css':
          c.write(JSON.stringify({
            path: 'task',
            target: this.css_target,
            value: this.css
          }));
          break;

        // Combined
        case 'periscope':
          c.write(JSON.stringify({
            path: 'periscope',
            value: this.compile()
          }));
          break;
      }
    }
  }
};

/** Access to pen instances via persistance api */
export class Pens extends Memory {
  _new() {
    return new Pen();
  }
};
