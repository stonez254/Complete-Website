(() => {
  'use strict';

  const PREFIX = 'ederstone-app:';
  const VERSION = 1;
  const listeners = new Map();

  const clone = value => {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  };

  const read = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? clone(fallback) : JSON.parse(raw);
    } catch (_) { return clone(fallback); }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('ederstone:state-change', { detail: { key, value: clone(value) } }));
      const set = listeners.get(key);
      if (set) set.forEach(fn => { try { fn(clone(value)); } catch (_) {} });
      return true;
    } catch (_) { return false; }
  };

  const remove = key => {
    try {
      localStorage.removeItem(PREFIX + key);
      window.dispatchEvent(new CustomEvent('ederstone:state-change', { detail: { key, value: null } }));
      return true;
    } catch (_) { return false; }
  };

  const subscribe = (key, fn) => {
    if (typeof fn !== 'function') return () => {};
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn);
    return () => listeners.get(key)?.delete(fn);
  };

  const store = Object.freeze({
    version: VERSION,
    prefix: PREFIX,
    get: read,
    set: write,
    remove,
    subscribe,
    keys: () => {
      try {
        return Object.keys(localStorage)
          .filter(key => key.startsWith(PREFIX))
          .map(key => key.slice(PREFIX.length));
      } catch (_) { return []; }
    }
  });

  window.EderStoneStore = store;
})();