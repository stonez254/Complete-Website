(() => {
  'use strict';

  const ROLE_PERMISSIONS = Object.freeze({
    owner: ['*'],
    manager: ['pos.read','pos.write','menu.manage','inventory.manage','reports.read','staff.read'],
    cashier: ['pos.read','pos.write','receipts.read'],
    kitchen: ['pos.read','kitchen.manage'],
    waiter: ['pos.read','orders.create'],
    delivery: ['delivery.read','delivery.update'],
    viewer: ['reports.read']
  });

  const permissionsFor = role => ROLE_PERMISSIONS[role] || [];
  const can = (role, permission) => {
    const list = permissionsFor(role);
    return list.includes('*') || list.includes(permission);
  };

  window.EderStonePermissions = Object.freeze({
    roles: Object.freeze(Object.keys(ROLE_PERMISSIONS)),
    permissionsFor,
    can
  });
})();