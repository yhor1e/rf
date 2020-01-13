importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "bbbc5f72330540b963e699f4ba16e41e"
  },
  {
    "url": "main.js",
    "revision": "0b9c8f91e8775ba44e3576474aa1c4f4"
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
    "revision": "6276f3607b19efba8d706d70a232cc43"
  }
]);

  const bgSyncPlugin = new workbox.backgroundSync.Plugin('issueQueue', {
    maxRetentionTime: 24 * 60,
    callbacks: {
      queueDidReplay: (args)=>{
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
} else {
  console.log(`Workbox didn't load`);
}
