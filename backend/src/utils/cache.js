const config = require('../config');

const store = new Map();

const cache = {
  get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },

  set(key, value, ttlMs = config.cache.ttlMs) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  },

  del(key) {
    store.delete(key);
  },

  clear() {
    store.clear();
  },

  size() {
    return store.size;
  },
};

module.exports = cache;
