(() => {
  'use strict';

  const data = window.EderStoneData;
  if (!data || !data.pos) return;

  const clone = value => {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  };

  const getDB = () => data.pos.get() || {};
  const saveDB = db => data.pos.set(db);

  const recordSale = (order, stockItems, tableNumber) => {
    const db = getDB();
    const items = clone(stockItems || []);
    const missing = [];

    items.forEach(item => {
      const stock = (db.foodStock || []).find(s => s.name === item.name);
      const available = stock ? Number(stock.qty || 0) : 0;
      if (!stock || Number(item.qty) > available) {
        missing.push({ name: item.name, available });
      }
    });

    if (missing.length) return { ok: false, missing };

    items.forEach(item => {
      const stock = db.foodStock.find(s => s.name === item.name);
      stock.qty = Math.max(0, Number(stock.qty || 0) - Number(item.qty || 0));
    });

    if (!Array.isArray(db.orders)) db.orders = [];
    db.orders.push(clone(order));

    if (tableNumber) {
      const table = (db.tables || [])[Number(tableNumber) - 1];
      if (table) {
        table.order = clone(items);
        table.status = 'Busy';
        table.paid = true;
        table.ready = false;
        table.lastPayment = order.payment;
      }
    }

    saveDB(db);
    return { ok: true, order: clone(order) };
  };

  window.EderStonePOSData = Object.freeze({
    version: 1,
    getDB,
    saveDB,
    recordSale
  });
})();