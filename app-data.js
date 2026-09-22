(() => {
  'use strict';

  const store = window.EderStoneStore;
  if (!store) return;

  const defaults = Object.freeze({
    preferences: {
      language: 'en',
      theme: 'dark'
    },
    app: {
      firstRun: true,
      lastVisited: '/'
    }
  });

  const get = key => store.get(key, defaults[key] ?? null);
  const set = (key, value) => store.set(key, value);

  window.EderStoneData = Object.freeze({
    version: 1,
    defaults,
    get,
    set,
    reset: key => {
      if (!(key in defaults)) return false;
      return set(key, defaults[key]);
    }
  });
})();