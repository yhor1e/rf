import { displayToast } from './toast.js';
import { getBackgroundSyncQueuedReqs } from './sync.js';

document.addEventListener('DOMContentLoaded', async function() {
  const settingDialog = document.querySelector('#setting-dialog'),
    syncDialog = document.querySelector('#sync-dialog'),
    showDialogButton = document.querySelector('#setting'),
    syncButton = document.querySelector('#sync'),
    notification = document.querySelector('.mdl-js-snackbar'),
    title = document.querySelector('#title'),
    description = document.querySelector('#description'),
    syncBadge = document.querySelector('#sync-badge'),
    urlParams = new URLSearchParams(window.location.search);

  title.value = urlParams.has('title') ? urlParams.get('title') : '';
  description.value = urlParams.has('description')
    ? urlParams.get('description')
    : '';

  showDialogButton.addEventListener('click', () => {
    settingDialog.showModal();
    document.getElementById('repository').value =
      localStorage.getItem('repository') || '';
    document.getElementById('access-token').value =
      localStorage.getItem('access-token') || '';
  });

  // Background Sync
  reflectBackgroundSyncInfo();

  navigator.serviceWorker.addEventListener('message', (e)=>{
    console.log('postmessage recieved');
    if (e.data === 'reflectBackgroundSyncInfo') {
      reflectBackgroundSyncInfo();
    }
  });


  async function reflectBackgroundSyncInfo() {
    const syncRequests = await getBackgroundSyncQueuedReqs();
    syncBadge.setAttribute('data-badge', syncRequests.length);

    let syncListHtmlStr = '';
    syncRequests.forEach(request => {
      const fragmentEl = document.createElement('div');
      fragmentEl.innerHTML = `
                            <li class="mdl-list__item mdl-list__item--three-line">
                              <span class="mdl-list__item-primary-content">
                                <span class="title"></span>
                                <span class="description mdl-list__item-text-body">
                                </span>
                              </span>
                            </li>
                            `;

      fragmentEl.querySelector('.title').innerText = request.title;
      fragmentEl.querySelector('.description').innerText = request.body;

      syncListHtmlStr += fragmentEl.innerHTML;
    });

    console.log(syncListHtmlStr);

    syncDialog.querySelector('#sync-list').innerHTML = syncListHtmlStr;
  }
  syncButton.addEventListener('click', () => {
    //  navigator.serviceWorker.controller.postMessage('getBackgroundSyncQueue');
    syncDialog.showModal();
  });

  syncDialog.querySelector('#sync').addEventListener('click', () => {
    syncDialog.close();
  });

  syncDialog.querySelector('.close').addEventListener('click', () => {
    syncDialog.close();
  });

  settingDialog.querySelector('.close').addEventListener('click', () => {
    settingDialog.close();
  });

  settingDialog.querySelector('#subscribe').addEventListener('click', () => {
    localStorage.setItem(
      'access-token',
      document.getElementById('access-token').value
    );
    localStorage.setItem(
      'repository',
      document.getElementById('repository').value
    );
    getUserName(localStorage.getItem('access-token'));
    settingDialog.close();
  });

  document.querySelector('#create-issue').addEventListener('click', () => {
    document.querySelector('#create-issue').disabled = true;
    fetch(
      'https://api.github.com/repos/' +
        localStorage.getItem('user-name') +
        '/' +
        localStorage.getItem('repository') +
        '/issues',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'token ' + localStorage.getItem('access-token')
        },
        method: 'POST',
        body: JSON.stringify({
          title: title.value,
          body: description.value
        })
      }
    )
      .then(response => {
        document.querySelector('#create-issue').disabled = false;
        displayToast(notification, response.statusText);

        if ('Created' === response.statusText) {
          title.value = '';
          description.value = '';
        }
      })
      .catch(error => {
        displayToast(notification, error.message);
        document.querySelector('#create-issue').disabled = false;
        title.value = '';
        description.value = '';
        reflectBackgroundSyncInfo();
      });
  });

  function getUserName(access_token) {
    fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + access_token
      },
      method: 'GET'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        localStorage.setItem('user-name', data.login);
        displayToast(
          notification,
          'Got user name "' + data.login + '" and stored localstorage'
        );
      })
      .catch(error => {
        displayToast(notification, error.message);
      });
  }
});
