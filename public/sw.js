const CACHE_NAME = 'gupfee-house-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync for cart updates, orders, etc.
      handleBackgroundSync()
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Gupfee House',
    icon: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
    badge: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Gupfee House', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync handler
async function handleBackgroundSync() {
  try {
    // Handle offline cart updates
    const cartUpdates = await getStoredCartUpdates();
    if (cartUpdates.length > 0) {
      await syncCartUpdates(cartUpdates);
    }

    // Handle offline orders
    const offlineOrders = await getStoredOfflineOrders();
    if (offlineOrders.length > 0) {
      await syncOfflineOrders(offlineOrders);
    }

    // Handle offline reviews
    const offlineReviews = await getStoredOfflineReviews();
    if (offlineReviews.length > 0) {
      await syncOfflineReviews(offlineReviews);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for background sync
async function getStoredCartUpdates() {
  // Implementation to get stored cart updates from IndexedDB
  return [];
}

async function syncCartUpdates(updates) {
  // Implementation to sync cart updates with server
  console.log('Syncing cart updates:', updates);
}

async function getStoredOfflineOrders() {
  // Implementation to get stored offline orders from IndexedDB
  return [];
}

async function syncOfflineOrders(orders) {
  // Implementation to sync offline orders with server
  console.log('Syncing offline orders:', orders);
}

async function getStoredOfflineReviews() {
  // Implementation to get stored offline reviews from IndexedDB
  return [];
}

async function syncOfflineReviews(reviews) {
  // Implementation to sync offline reviews with server
  console.log('Syncing offline reviews:', reviews);
}