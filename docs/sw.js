importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "5431b8516772d2fad5d4af3950bce80b"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "3736e98d53a194b9e824d487789ec917"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "204a25013f60f59c251cab6cf4e194f8"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "b93ac6e5faf46f5a9aeb15348a6a0339"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "973641b5bc4ee249938c9eb06087ac9b"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "cd6981581f4e75af0856fa26c9e9bf3b"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "bddc3703a345f303e364826854d3f663"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "4e1dba3319ce6ab3489afe4d92438e67"
  },
  {
    "url": "index.html",
    "revision": "4fdf79b21a3e3cd3e5efedca89f83681"
  },
  {
    "url": "main.js",
    "revision": "103f419a9ba868fc8cfc03d381a13fb9"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "88af2137d903fe8a10f7d8c7f4b70449"
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
            self.registration.showNotification('Background sync failed!', {
              body: '😩😩😩 ' + response.status + ' ' + response.statusText
            });
            if (response.status !== 401 && response.status !== 422) {
              throw new Error('response status is 4xx - 5xx');
            }
          }
        } catch (error) {
          await queue.unshiftRequest(entry);
          console.log('BackgroundSync Replay failed');
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

    // if (e.data === 'onSync') {
    //   e = new SyncEvent('sync', {
    //     tag: 'workbox-background-sync:issueQueue',
    //     lastChance: true
    //   });
    //   self.dispatchEvent(e);
    //   //bgSyncPlugin._queue._onSync({ queue: bgSyncPlugin._queue });
    // }
  });

  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('Now ready to handle fetches!');
  });
} else {
  console.log(`Workbox didn't load`);
}
