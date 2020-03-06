importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "4c64de3c26d61a8b0ab2b3595a7b70e8"
  },
  {
    "url": "main.js",
    "revision": "f22b325c191a09a6c1b2dfdbe2434d6a"
  },
  {
    "url": "material-icons.css",
    "revision": "c5941eed2e20a509114128aab1e96edf"
  },
  {
    "url": "material.blue_grey-blue.min.css",
    "revision": "4e1b23f7c85e9bf4b4738c7353da13cb"
  },
  {
    "url": "material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "MaterialIcons-Regular.woff2",
    "revision": "570eb83859dc23dd0eec423a49e147fe"
  },
  {
    "url": "toast.js",
    "revision": "9c9ae97ac22518f181d31728e70e785d"
  }
]);

  const bgSyncPlugin = new workbox.backgroundSync.Plugin('issueQueue', {
    maxRetentionTime: 24 * 60,
    onSync: async ({ queue }) => {
      let entry;
      while ((entry = await queue.shiftRequest())) {
        try {
          let response = await fetch(entry.request.clone());
          if (!response.ok) {
            throw new Error('response status is 4xx - 5xx');
          }
        } catch (error) {
          await queue.unshiftRequest(entry);
          self.registration.showNotification('Background sync failed!', {
            body: '😩😩😩'
          });
          console.log('BackgroundSync Replay failed');
          throw new Error();
        }
      }
      self.registration.showNotification('Background sync done!', {
        body: '🎉`🎉`🎉`'
      });
      console.log('BackgroundSync Replay complete!');
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
