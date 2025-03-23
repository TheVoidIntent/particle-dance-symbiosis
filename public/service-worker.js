// Mother Simulation Service Worker
// This enables the simulation to potentially run even when the tab is in background

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Mother Simulation Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Mother Simulation Service Worker activated');
});

// We'll keep this minimal for now, but could be expanded to run 
// simulation in the background if browser APIs allow it
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PING') {
    event.ports[0].postMessage('PONG');
  }
});
