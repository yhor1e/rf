importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([]);

  const bgSyncPlugin = new workbox.backgroundSync.Plugin('issueQueue', {
    maxRetentionTime: 24 * 60,
    callbacks: {
      queueDidReplay: args => {
        console.log(args);
        self.registration.showNotification('Background sync done!', {
          body: '🎉`🎉`🎉`'
        });
      }
    }
  });
  workbox.routing.registerRoute(
    /\.*/,
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  );

  self.addEventListener('sync', () => {
    console.log('sync triggered');
  });
  self.addEventListener('message', function(e) {
    console.log('postMessage received', e);
    if (e.data === 'getBackgroundSyncQueue') {
      getBackgroundSyncQueue();
    }
  });
  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('Now ready to handle fetches!');
  });
} else {
  console.log(`Workbox didn't load`);
}

function getBackgroundSyncQueue() {
  let open = indexedDB.open('workbox-background-sync');

  open.onsuccess = function() {
    let db = open.result;
    if (db.objectStoreNames.length === 0) {
      return;
    }
    let tx = db.transaction('requests');
    let store = tx.objectStore('requests');

    store.getAll().onsuccess = function(event) {
      const dataArr = event.target.result;
      dataArr.forEach(data => {
        console.log(new Date(data.storableRequest.timestamp));
        data.storableRequest.requestInit.body.text().then(d => {
          console.log(d);
        });
      });
    };

    tx.oncomplete = function() {
      db.close();
    };
  };
}
