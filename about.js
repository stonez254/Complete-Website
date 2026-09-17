document.addEventListener('DOMContentLoaded', () => {
  // The rebuilt About page is intentionally lightweight.
  // Keep optional fullscreen support available without assuming legacy elements exist.
  const fullScreenBtn = document.getElementById('fullscreen-btn');

  if (fullScreenBtn) {
    fullScreenBtn.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen?.();
        } else {
          await document.exitFullscreen?.();
        }
      } catch (error) {
        console.warn('Fullscreen unavailable:', error);
      }
    });
  }
});