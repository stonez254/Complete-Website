(() => {
  'use strict';

  const APP_VERSION = 'phase-1.1';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    });
  }

  const loadScriptOnce = src => new Promise(resolve => {
    if (document.querySelector('script[data-ederstone-core="' + src + '"]')) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.ederstoneCore = src;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  /* Shared state/data are loaded once so future modules can use the same application layer. */
  loadScriptOnce('/app-state.js').then(() => loadScriptOnce('/app-data.js'));

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