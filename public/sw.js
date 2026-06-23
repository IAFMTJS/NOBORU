const CACHE_VERSION = "noboru-v5";
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const OFFLINE_DB_NAME = "noboru-offline";
const OFFLINE_DB_VERSION = 1;
const OFFLINE_SYNC_QUEUE = "sync_queue";
const OFFLINE_BACKGROUND_SYNC_TAG = "noboru-offline-sync";

/** Static assets only — navigation routes need auth and must not fail install. */
const STATIC_PRECACHE_URLS = [
  "/manifest.json",
  "/offline",
  "/icons/icon-192_v1.webp",
  "/icons/icon-512_v1.webp",
  "/icons/apple-touch-icon_v1.png",
  "/art-library/icons/icon_nav_journey_mountain_dark_v1.webp",
  "/art-library/icons/icon_nav_camp_tent_dark_v1.webp",
  "/art-library/icons/icon_nav_study_book_dark_v1.webp",
  "/art-library/icons/icon_nav_bag_backpack_dark_v1.webp",
  "/art-library/icons/icon_nav_profile_person_dark_v1.webp",
  "/art-library/characters/kitsune/base/kitsune_sitting_campfire_light_v1.webp",
  "/art-library/characters/kitsune/base/kitsune_sitting_campfire_dark_v1.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => precacheUrls(cache, STATIC_PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("sync", (event) => {
  if (event.tag === OFFLINE_BACKGROUND_SYNC_TAG) {
    event.waitUntil(syncOfflineQueueFromIndexedDb());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  const isAudioRequest =
    request.destination === "audio" ||
    /\.(mp3|m4a|aac|wav|ogg|opus)(\?|$)/i.test(url.pathname);

  if (url.origin !== self.location.origin) {
    if (isAudioRequest) {
      event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    }
    return;
  }

  if (isAudioRequest) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/art-library/")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, APP_SHELL_CACHE));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    return;
  }
});

async function precacheUrls(cache, urls) {
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch {
        // Skip failed precache entries; runtime fetch still works online.
      }
    }),
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offlineFallback = await cache.match("/offline");
    if (offlineFallback) return offlineFallback;
    return Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void refresh;
    return cached;
  }

  const response = await refresh;
  if (response) return response;
  return Response.error();
}

function openOfflineDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function listPendingOfflineMutations() {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OFFLINE_SYNC_QUEUE, "readonly");
    const store = transaction.objectStore(OFFLINE_SYNC_QUEUE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const mutations = (request.result ?? []).filter(
        (mutation) => mutation.status !== "syncing",
      );
      resolve(mutations);
    };
  });
}

async function removeOfflineMutations(ids) {
  if (ids.length === 0) return;
  const db = await openOfflineDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(OFFLINE_SYNC_QUEUE, "readwrite");
    const store = transaction.objectStore(OFFLINE_SYNC_QUEUE);
    for (const id of ids) {
      store.delete(id);
    }
    transaction.oncomplete = () => resolve(undefined);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function setOfflineLastSyncedAt(iso) {
  const db = await openOfflineDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction("meta", "readwrite");
    const store = transaction.objectStore("meta");
    store.put({ key: "lastSyncedAt", value: iso, updatedAt: iso });
    transaction.oncomplete = () => resolve(undefined);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function syncOfflineQueueFromIndexedDb() {
  const pending = await listPendingOfflineMutations();
  if (pending.length === 0) return;

  const response = await fetch("/api/sync/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      mutations: pending.map((mutation) => ({
        id: mutation.id,
        type: mutation.type,
        payload: mutation.payload,
        clientTimestamp: mutation.clientTimestamp,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Background sync failed.");
  }

  const payload = await response.json();
  const appliedIds = (payload.data?.applied ?? []).map(
    (entry) => entry.mutationId,
  );

  if (appliedIds.length > 0) {
    await removeOfflineMutations(appliedIds);
    await setOfflineLastSyncedAt(new Date().toISOString());
  }
}
