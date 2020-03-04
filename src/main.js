import {displayToast} from './toast.js';

document.addEventListener("DOMContentLoaded", function() {

  const dialog = document.querySelector('dialog'),
        showDialogButton = document.querySelector('#setting'),
        syncButton = document.querySelector('#sync'),
        notification = document.querySelector('.mdl-js-snackbar'),
        title = document.querySelector('#title'),
        description = document.querySelector('#description'),
        urlParams = new URLSearchParams(window.location.search);

  title.value = urlParams.has('title') ? urlParams.get('title') : '';
  description.value = urlParams.has('description') ? urlParams.get('description') : '';

  showDialogButton.addEventListener('click', () => {
    dialog.showModal();
    document.getElementById('repository').value = localStorage.getItem('repository') || '';
    document.getElementById('access-token').value = localStorage.getItem('access-token') || '';
  });

  syncButton.addEventListener('click', () => {
    navigator.serviceWorker.controller.postMessage('getBackgroundSyncQueue');
  });

  dialog.querySelector('.close').addEventListener('click', () => {
    dialog.close();
  });

  dialog.querySelector('#subscribe').addEventListener('click', () => {
    localStorage.setItem('access-token', document.getElementById('access-token').value);
    localStorage.setItem('repository', document.getElementById('repository').value);
    getUserName(localStorage.getItem('access-token'));
    dialog.close();
  });

  document.querySelector('#create-issue').addEventListener('click', ()=>{
    document.querySelector('#create-issue').disabled = true;
    fetch('https://api.github.com/repos/' + localStorage.getItem('user-name') + '/' + localStorage.getItem('repository') + '/issues', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ' + localStorage.getItem('access-token')
      },
      method: 'POST',
      body: JSON.stringify({
        title: title.value,
        body: description.value
      })
    }).then((response) => {
      document.querySelector('#create-issue').disabled = false;
      displayToast(notification, response.statusText);

      if('Created' === response.statusText){
        title.value = '';
        description.value = '';
      }

    }).catch((error) => {
      displayToast(notification, error.message);
      document.querySelector('#create-issue').disabled = false;
      title.value = '';
      description.value = '';
      displayToast(notification, 'Queued');
    });
  });

  function getUserName (access_token) {
    fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ' + access_token
      },
      method: "GET"
    }).then((response) => {
      return response.json();
    }).then((data) => {
      localStorage.setItem('user-name', data.login);
      displayToast(notification, 'Got user name "' + data.login + '" and stored localstorage');
    }).catch((error) => {
      displayToast(notification, error.message);
    });
  }
});
