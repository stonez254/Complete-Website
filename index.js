document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      const target = targetId && document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  const canvas = document.getElementById('rain-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let drops = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(220, Math.max(85, Math.floor(width / 7)));
    drops = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 22,
      speed: 8 + Math.random() * 13,
      opacity: 0.18 + Math.random() * 0.42,
      drift: -0.7 - Math.random() * 0.5
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    drops.forEach(drop => {
      ctx.strokeStyle = `rgba(155, 220, 255, ${drop.opacity})`;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + drop.drift, drop.y + drop.length);
      ctx.stroke();
      drop.x += drop.drift;
      drop.y += drop.speed;
      if (drop.y > height + drop.length) {
        drop.y = -drop.length - Math.random() * 80;
        drop.x = Math.random() * width;
      }
      if (drop.x < -20) drop.x = width + 10;
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
});