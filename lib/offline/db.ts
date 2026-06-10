"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import {
  OFFLINE_DB_NAME,
  OFFLINE_DB_VERSION,
  OFFLINE_STORES,
} from "@/lib/offline/constants";
import type {
  OfflineAudioRecord,
  OfflineLessonRecord,
  OfflineMetaRecord,
  OfflineReviewBundle,
  OfflineSyncMutation,
} from "@/lib/offline/types";

interface NoboruOfflineDb extends DBSchema {
  [OFFLINE_STORES.lessons]: {
    key: string;
    value: OfflineLessonRecord;
  };
  [OFFLINE_STORES.reviewBundles]: {
    key: string;
    value: OfflineReviewBundle;
  };
  [OFFLINE_STORES.syncQueue]: {
    key: string;
    value: OfflineSyncMutation;
    indexes: { status: string };
  };
  [OFFLINE_STORES.audio]: {
    key: string;
    value: OfflineAudioRecord;
  };
  [OFFLINE_STORES.meta]: {
    key: string;
    value: OfflineMetaRecord;
  };
}

let dbPromise: Promise<IDBPDatabase<NoboruOfflineDb>> | null = null;

export function getOfflineDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser.");
  }

  if (!dbPromise) {
    dbPromise = openDB<NoboruOfflineDb>(OFFLINE_DB_NAME, OFFLINE_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(OFFLINE_STORES.lessons)) {
          db.createObjectStore(OFFLINE_STORES.lessons, { keyPath: "lessonId" });
        }
        if (!db.objectStoreNames.contains(OFFLINE_STORES.reviewBundles)) {
          db.createObjectStore(OFFLINE_STORES.reviewBundles, { keyPath: "userId" });
        }
        if (!db.objectStoreNames.contains(OFFLINE_STORES.syncQueue)) {
          const queue = db.createObjectStore(OFFLINE_STORES.syncQueue, {
            keyPath: "id",
          });
          queue.createIndex("status", "status");
        }
        if (!db.objectStoreNames.contains(OFFLINE_STORES.audio)) {
          db.createObjectStore(OFFLINE_STORES.audio, { keyPath: "url" });
        }
        if (!db.objectStoreNames.contains(OFFLINE_STORES.meta)) {
          db.createObjectStore(OFFLINE_STORES.meta, { keyPath: "key" });
        }
      },
    });
  }

  return dbPromise;
}
