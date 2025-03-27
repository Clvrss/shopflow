---
title: In-memory cache and rate limiter never evict
labels: ["bug", "P3", "platform", "performance"]
---

**Describe the bug**
`cache.js` and `rateLimiter.js` both use plain `Map`s that never remove keys, so
memory grows without bound under sustained traffic.

**Expected behavior**
Entries should expire (TTL) and ideally an upper size bound (LRU) should apply.

**Files**
- `backend/src/utils/cache.js`
- `backend/src/middleware/rateLimiter.js`
