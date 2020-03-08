importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([]);

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
