(() => {
  'use strict';

  const APP_VERSION = 'phase-1.1';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    });
  }

  window.EderStoneApp = Object.freeze({
    version: APP_VERSION,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
  });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    window.__ederstoneInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('ederstone:install-ready'));
  });
})();