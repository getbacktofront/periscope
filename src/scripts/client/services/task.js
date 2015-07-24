import Service from '../lib/service.js';
import $ from 'jquery/dist/jquery';

/** Publish the output string to the given target */
export default function handler() {
  return new Service('task', (data, c, next) => {
    $(data.target).val(data.value);
    next();
  });
};
