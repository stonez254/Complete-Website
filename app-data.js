(() => {
  'use strict';

  const store = window.EderStoneStore;
  if (!store) return;

  const defaults = Object.freeze({
    preferences: { language: 'en', theme: 'dark' },
    app: { firstRun: true, lastVisited: '/' }
  });

  const get = key => store.get(key, defaults[key] ?? null);
  const set = (key, value) => store.set(key, value);

  const domain = key => ({
    get: () => store.get('pos', null)?.[key] ?? null,
    set: value => {
      const pos = store.get('pos', {});
      const next = Object.assign({}, pos, { [key]: value });
      return store.set('pos', next);
    },
    update: updater => {
      const pos = store.get('pos', {});
      const current = pos[key];
      const nextValue = typeof updater === 'function' ? updater(current) : updater;
      return domain(key).set(nextValue);
    }
  });

  const pos = Object.freeze({
    get: () => store.get('pos', null),
    set: value => store.set('pos', value),
    orders: domain('orders'),
    menu: domain('menu'),
    inventory: domain('inventory'),
    staff: domain('staff'),
    tables: domain('tables'),
    settings: domain('settings'),
    tasks: domain('unfinishedTasks'),
    kitchen: domain('kitchenJobs'),
    delivery: domain('deliveryJobs'),
    foodStock: domain('foodStock'),
    recipes: domain('recipes')
  });

  const sync = Object.freeze({
    enabled: () => !!window.EderStonePOSSync,
    pull: () => window.EderStonePOSSync?.pull?.(),
    push: () => window.EderStonePOSSync?.push?.(),
    status: () => window.EderStonePOSSync?.status?.() || { online: navigator.onLine, synced: false }
  });

  window.EderStoneData = Object.freeze({
    version: 2,
    defaults,
    get,
    set,
    reset: key => {
      if (!(key in defaults)) return false;
      return set(key, defaults[key]);
    },
    pos,
    sync
  });
})();