importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "58eb20ae6d5f0c4336a344fd5dbf6f14"
  },
  {
    "url": "main.js",
    "revision": "2b43d93ed8a71d8d4bd2d9980f82bebd"
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
} else {
  console.log(`Workbox didn't load`);
}
