import {Memory} from '../lib/persist/memory';

/** This class represents a single html/css/javascript combo as a single page */
export class Pen {
  constructor() {
    this.html = '';
    this.js = '';
    this.css = '';
  }

  /** Compile into one block of stuff */
  compile() {
    var js = JSON.stringify(this.js);
    var rtn = '<style>'+this.css+'</style>'+this.html+'<script>var script = ' + js + '; try { eval(script); } catch(err) { console.log(err); }</script>';
    console.log(rtn);
    return rtn;
  }
};

/** Access to pen instances via persistance api */
export class Pens extends Memory {
  _new() {
    return new Pen();
  }
};
