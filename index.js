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
  let splashes = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastTime = performance.now();

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(260, Math.max(100, Math.floor(width / 5.8)));
    drops = Array.from({ length: count }, () => createDrop(true));
    splashes = [];
  };

  const createDrop = (randomY = false) => {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30,
      length: 9 + depth * 28,
      speed: 420 + depth * 680,
      width: depth > .7 ? 1.25 : .75,
      opacity: 0.12 + depth * 0.48,
      wind: -34 - Math.random() * 24,
      depth
    };
  };

  const addSplash = (x, y) => {
    if (splashes.length > 55 || Math.random() > 0.13) return;
    splashes.push({ x, y, life: 1, size: 2 + Math.random() * 4 });
  };

  const draw = now => {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    ctx.clearRect(0, 0, width, height);

    drops.forEach(drop => {
      const dx = (drop.wind * dt) / 60;
      const dy = drop.speed * dt;
      const tailX = drop.x + dx * 1.8;
      const tailY = drop.y + drop.length;

      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(tailX, tailY);
      ctx.lineWidth = drop.width;
      ctx.strokeStyle = `rgba(178, 226, 255, ${drop.opacity})`;
      ctx.stroke();

      drop.x += dx;
      drop.y += dy;

      if (drop.y > height - 2) {
        addSplash(drop.x, height - 1);
        Object.assign(drop, createDrop(false));
      }
      if (drop.x < -50) drop.x = width + 20;
    });

    splashes = splashes.filter(splash => splash.life > 0);
    splashes.forEach(splash => {
      splash.life -= dt * 2.8;
      const radius = splash.size * (1.4 - splash.life * .4);
      ctx.beginPath();
      ctx.ellipse(splash.x, splash.y, radius, radius * .28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(185, 229, 255, ${Math.max(0, splash.life) * .3})`;
      ctx.lineWidth = .7;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
});