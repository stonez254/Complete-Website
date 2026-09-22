(() => {
  'use strict';

  const KEY = 'pos';
  let serverVersion = 0;
  let syncing = false;
  let lastSyncAt = 0;
  let lastError = null;

  const store = () => window.EderStoneStore;
  const localState = () => store()?.get(KEY, null);

  const emit = () => window.dispatchEvent(new CustomEvent('ederstone:sync-status', {
    detail: { online: navigator.onLine, synced: serverVersion > 0, syncing, lastSyncAt, lastError }
  }));

  async function pull() {
    if (!navigator.onLine || syncing) return false;
    syncing = true; lastError = null; emit();
    try {
      const response = await fetch('/api/pos', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Sync pull failed');
      if (result.state && store()) store().set(KEY, result.state);
      serverVersion = Number(result.version || 0);
      lastSyncAt = Date.now();
      return true;
    } catch (error) {
      lastError = error?.message || 'Sync pull failed';
      return false;
    } finally {
      syncing = false; emit();
    }
  }

  async function push() {
    if (!navigator.onLine || syncing) return false;
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
        await pull();
        throw new Error('Server state changed; local state was refreshed');
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Sync push failed');
      serverVersion = Number(result.version || serverVersion);
      lastSyncAt = Date.now();
      return true;
    } catch (error) {
      lastError = error?.message || 'Sync push failed';
      return false;
    } finally {
      syncing = false; emit();
    }
  }

  window.EderStonePOSSync = Object.freeze({
    pull,
    push,
    status: () => ({ online: navigator.onLine, synced: serverVersion > 0, syncing, lastSyncAt, lastError })
  });

  window.addEventListener('online', () => pull());
  window.addEventListener('load', () => pull());
  window.addEventListener('ederstone:state-change', event => {
    if (event.detail?.key === KEY && event.detail?.source !== 'storage') {
      clearTimeout(window.__ederstoneSyncTimer);
      window.__ederstoneSyncTimer = setTimeout(push, 900);
    }
  });
})();
