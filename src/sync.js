export { getBackgroundSyncQueuedReqs };

const getBackgroundSyncQueuedReqs = async () => {
  const queue = await getBackgroundSyncQueue();
  let requests = [];
  if (queue !== []){
    requests = queue.map(request => JSON.parse((new TextDecoder('utf-8')).decode(request.requestData.body)));
  }
  return requests;
};

async function getBackgroundSyncQueue() {
  return new Promise((resolve) => {
    let open = indexedDB.open('workbox-background-sync');

    open.onsuccess = function() {
      let db = open.result;
      if (db.objectStoreNames.length === 0) {
        resolve([]);
        return;
      }
      let tx = db.transaction('requests');
      let store = tx.objectStore('requests');

      store.getAll().onsuccess = function(event) {
        const dataArr = event.target.result;
        resolve(dataArr);
      };

      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
