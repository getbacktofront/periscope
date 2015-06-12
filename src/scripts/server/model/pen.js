/** This class represents a single html/css/javascript combo as a single page */
export class Pen {
  constructor() {
    this.html = '';
    this.js = '';
    this.css = '';
  }

  /** Compile into one block of stuff */
  compile() {
    return '<style>'+this.css+'</style>'+this.html+'<script>'+this.js+'</script>';
  }
};

/** Access to pen instances via persistance api */
export class PenFactory {
};
