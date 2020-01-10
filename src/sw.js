importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute([]);
} else {
  console.log(`Workbox didn't load`);
}
