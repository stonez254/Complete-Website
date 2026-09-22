(() => {
  'use strict';

  const PREFIX = 'ederstone-app:';
  const VERSION = 2;
  const listeners = new Map();
  const clone = value => { try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; } };

  const notify = (key, value, source) => {
    const detail = { key, value: clone(value), source: source || 'local' };
    window.dispatchEvent(new CustomEvent('ederstone:state-change', { detail }));
    const set = listeners.get(key);
    if (set) set.forEach(fn => { try { fn(clone(value), detail); } catch (_) {} });
  };

  const read = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? clone(fallback) : JSON.parse(raw);
    } catch (_) { return clone(fallback); }
  };

  const write = (key, value) => {
    try {
      const next = clone(value);
      localStorage.setItem(PREFIX + key, JSON.stringify(next));
      notify(key, next, 'local');
      return true;
    } catch (_) { return false; }
  };

  const remove = key => {
    try {
      localStorage.removeItem(PREFIX + key);
      notify(key, null, 'local');
      return true;
    } catch (_) { return false; }
  };

  const subscribe = (key, fn) => {
    if (typeof fn !== 'function') return () => {};
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn);
    return () => {
      const set = listeners.get(key);
      if (set) {
        set.delete(fn);
        if (!set.size) listeners.delete(key);
      }
    };
  };

  window.addEventListener('storage', event => {
    if (!event.key || !event.key.startsWith(PREFIX)) return;
    let value = null;
    try { value = event.newValue === null ? null : JSON.parse(event.newValue); } catch (_) {}
    notify(event.key.slice(PREFIX.length), value, 'storage');
  });

  const store = Object.freeze({
    version: VERSION,
    prefix: PREFIX,
    get: read,
    set: write,
    remove,
    subscribe,
    keys: () => {
      try {
        return Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).map(k => k.slice(PREFIX.length));
      } catch (_) { return []; }
    }
  });

  window.EderStoneStore = store;
})();