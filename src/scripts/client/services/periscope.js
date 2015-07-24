import Service from '../lib/service.js';
import $ from 'jquery/dist/jquery';

/** Publish the output string to the given target */
var locked = false;
export default function handler() {
  return new Service('periscope', (data, c, next) => {
    // console.log("Periscope....");
    // console.log(data);
    if (!locked) {
      // console.log("Incoming");
      var ifrm = $('#periscope > iframe').replaceWith('<iframe>');
      locked = true;
      setTimeout(function() {
        // console.log("Bind~");
        var ifrm = $('#periscope > iframe')[0];
        ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
        ifrm.document.open();
        ifrm.document.write(data.value);
        ifrm.document.close();
        locked = false;
        next();
      }, 1);
    }
  });
}
