importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([]);

  const bgSyncPlugin = new workbox.backgroundSync.Plugin("issueQueue", {
    maxRetentionTime: 24 * 60,
    callbacks: {
      queueDidReplay: args => {
        console.log(args);
        self.registration.showNotification("Background sync done!", {
          body: "🎉`🎉`🎉`"
        });
      }
    }
  });
  workbox.routing.registerRoute(
    /\.*/,
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    "POST"
  );

  self.addEventListener('sync', ()=>{console.log('sync triggered')})
  self.addEventListener('message', function(e) {
    console.log("postMessage received", e);
    if(e.data === 'getBackgroundSyncQueue'){
      const syncEvent = new Event('sync');
      syncEvent.tag = 'workbox-background-sync:issueQueue';
      self.dispatchEvent(syncEvent);
    }
  });
} else {
  console.log(`Workbox didn't load`);
}
