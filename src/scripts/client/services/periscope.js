import Service from '../lib/service.js';
import $ from 'jquery/dist/jquery';

/** Publish the output string to the given target */
module.exports = function() {
  return new Service('periscope', (data, c, next) => {
    var ifrm = document.getElementById('periscope');
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(data.value);
    ifrm.document.close();
    next();
  });
};
