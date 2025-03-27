---
title: "Today" revenue bucket uses local server time
labels: ["bug", "P3", "admin"]
---

**Describe the bug**
`formatDateLegacy()` uses the server's local date while `created_at` is stored
in UTC, so near midnight the "today" bucket is wrong / off by one day.

**Expected behavior**
Date bucketing should use a single, explicit timezone (e.g. UTC).

**Files**
- `backend/src/services/adminService.js`
