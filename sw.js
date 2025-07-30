/* Service Worker for MSG株式会社
   キャッシュ戦略とオフライン対応 */

const CACHE_NAME = 'msg-corp-v1.0.0';
const STATIC_CACHE = 'msg-static-v1';
const DYNAMIC_CACHE = 'msg-dynamic-v1';

// キャッシュするリソース
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/critical.css',
  '/scripts.js',
  '/analytics.js',
  '/structured-data.js',
  '/terms-of-service.html',
  'https://unpkg.com/lucide@latest'
];

// 動的キャッシュ対象（画像など）
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/hebbkx1anhila5yf\.public\.blob\.vercel-storage\.com\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/
];

// インストール時の処理
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// アクティベート時の処理
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // HTMLファイルの処理（Cache First戦略）
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // バックグラウンドで更新
            fetch(request)
              .then(response => {
                if (response.ok) {
                  const responseClone = response.clone();
                  caches.open(STATIC_CACHE)
                    .then(cache => cache.put(request, responseClone));
                }
              });
            return cachedResponse;
          }
          
          return fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
        .catch(() => {
          // オフライン時のフォールバック
          return caches.match('/index.html');
        })
    );
    return;
  }
  
  // 静的アセット（CSS, JS）の処理（Cache First戦略）
  if (CACHE_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }
  
  // 画像などの動的コンテンツ（Stale While Revalidate戦略）
  if (DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              const fetchPromise = fetch(request)
                .then(response => {
                  if (response.ok) {
                    cache.put(request, response.clone());
                  }
                  return response;
                })
                .catch(() => cachedResponse);
              
              return cachedResponse || fetchPromise;
            });
        })
    );
    return;
  }
  
  // その他のリクエスト（Network First戦略）
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// バックグラウンド同期
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // バックグラウンドでデータ同期処理
      syncData()
    );
  }
});

// プッシュ通知
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'MSG株式会社からのお知らせ',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'msg-notification',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification('MSG株式会社', options)
  );
});

// 通知クリック時の処理
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// ヘルパー関数
async function syncData() {
  try {
    // データ同期ロジック
    console.log('Service Worker: Syncing data...');
    // 実際の同期処理をここに実装
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
    throw error;
  }
}

// キャッシュサイズ制限
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxItems);
  }
}

// 定期的なキャッシュクリーンアップ
setInterval(() => {
  limitCacheSize(DYNAMIC_CACHE, 100);
}, 300000); // 5分ごと