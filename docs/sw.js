importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "7ae375c06cfdd272a7028b08490e8a3f"
  },
  {
    "url": "main.js",
    "revision": "dadae059f7666353c9c98bc0892bb843"
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
    "url": "sync.js",
    "revision": "93b881254a269a01388ef8727bbee099"
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
          //throw new Error();
          throw new Error('queue-replay-failed');
        }
      }
      self.registration.showNotification('Background sync done!', {
        body: '🎉`🎉`🎉`'
      });
      self.clients
        .matchAll()
        .then(all =>
          all.map(client => client.postMessage('reflectBackgroundSyncInfo'))
        );
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

  self.addEventListener('message', e => {
    console.log('massage recieved (sw)');
    if (e.data === 'onSync') {
      // e = (new Event('sync'));
      // e.tag = 'workbox-background-sync:requests';
      // self.dispatchEvent(e)
      bgSyncPlugin._queue._onSync({ queue: bgSyncPlugin._queue });
    }
  });

  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('Now ready to handle fetches!');
  });
} else {
  console.log(`Workbox didn't load`);
}
