console.log(`this is module`);

import {displayToast} from './toast.js';

document.addEventListener('DOMContentLoaded', function() {

  window.addEventListener('click', () => {
    const notification = document.querySelector('.mdl-js-snackbar');
    displayToast(notification, 'message');
  });
});
