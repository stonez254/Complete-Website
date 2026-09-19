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

// Ederstone album-style meaning expansion
const albumButton=document.getElementById('ederstone-album-toggle');
const albumPanel=document.getElementById('ederstone-expanded-meaning');
if(albumButton&&albumPanel){
  albumButton.addEventListener('click',()=>{
    const isOpen=albumButton.getAttribute('aria-expanded')==='true';
    albumButton.setAttribute('aria-expanded',String(!isOpen));
    albumPanel.hidden=isOpen;
    if(!isOpen)setTimeout(()=>albumPanel.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
  });
}