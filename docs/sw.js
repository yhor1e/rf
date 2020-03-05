importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
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
      const syncEvent = new Event('sync');
      syncEvent.tag = 'workbox-background-sync:issueQueue';
      self.dispatchEvent(syncEvent);
    }
  });
} else {
  console.log(`Workbox didn't load`);
}
