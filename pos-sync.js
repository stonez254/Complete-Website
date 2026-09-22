(() => {
  'use strict';

  const KEY = 'pos';
  let serverVersion = 0;
  let syncing = false;
  let suppressPush = false;
  let lastSyncAt = 0;
  let lastError = null;
  let queued = false;

  const store = () => window.EderStoneStore;
  const localState = () => store()?.get(KEY, null);
  const emit = () => window.dispatchEvent(new CustomEvent('ederstone:sync-status', {
    detail: { online: navigator.onLine, synced: serverVersion > 0, syncing, queued, lastSyncAt, lastError }
  }));

  async function pullInternal() {
    const response = await fetch('/api/pos', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'Sync pull failed');

    if (result.state && store()) {
      suppressPush = true;
      try { store().set(KEY, result.state); } finally { suppressPush = false; }
    }
    serverVersion = Number(result.version || 0);
    lastSyncAt = Date.now();
    queued = false;
    return true;
  }

  async function pull() {
    if (!navigator.onLine || syncing) return false;
    syncing = true; lastError = null; emit();
    try { return await pullInternal(); }
    catch (error) { lastError = error?.message || 'Sync pull failed'; return false; }
    finally { syncing = false; emit(); }
  }

  async function push() {
    if (!navigator.onLine) { queued = true; emit(); return false; }
    if (syncing) { queued = true; emit(); return false; }

    const state = localState();
    if (!state) return false;

    syncing = true; lastError = null; emit();
    try {
      const response = await fetch('/api/pos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, expectedVersion: serverVersion || null })
      });
      const result = await response.json();

      if (response.status === 409) {
        await pullInternal();
        lastError = 'Server state changed; refreshed from server';
        return false;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Sync push failed');

      serverVersion = Number(result.version || serverVersion);
      lastSyncAt = Date.now();
      queued = false;
      return true;
    } catch (error) {
      lastError = error?.message || 'Sync push failed';
      queued = true;
      return false;
    } finally {
      syncing = false;
      emit();
      if (queued && navigator.onLine) {
        clearTimeout(window.__ederstoneSyncRetry);
        window.__ederstoneSyncRetry = setTimeout(push, 1500);
      }
    }
  }

  window.EderStonePOSSync = Object.freeze({
    pull,
    push,
    status: () => ({ online: navigator.onLine, synced: serverVersion > 0, syncing, queued, lastSyncAt, lastError })
  });

  window.addEventListener('online', () => {
    pull().then(() => push());
  });

  window.addEventListener('load', () => pull());

  window.addEventListener('ederstone:state-change', event => {
    if (event.detail?.key !== KEY || event.detail?.source === 'storage' || suppressPush) return;
    clearTimeout(window.__ederstoneSyncTimer);
    window.__ederstoneSyncTimer = setTimeout(push, 900);
  });
})();
