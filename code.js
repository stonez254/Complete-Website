document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  const langSelector = document.getElementById('language-selector');
  const runBtn = document.getElementById('run-btn');
  const outputScreen = document.getElementById('output-screen');
  const errorConsole = document.getElementById('error-console');
  const rainCanvas = document.getElementById('rain-canvas');

  if (!editor || !langSelector || !runBtn || !outputScreen || !errorConsole) return;

  const examples = {
    html: `<main style="font-family:system-ui;padding:32px"><h1>Hello, Ederstone.</h1><p>Build something useful.</p></main>`,
    css: `body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: linear-gradient(135deg, #05060b, #35101d);\n  color: white;\n  font-family: system-ui;\n}\nh1 { letter-spacing: -0.04em; }`,
    javascript: `const message = "Code executed successfully!";\nconsole.log(message);\ndocument.body.innerHTML = \`<main style="font:600 18px system-ui;padding:32px"><h2>\${message}</h2></main>\`;`,
    python: `print("Hello from Python")\n\nfor n in range(5):\n    print(n)`
  };

  function showError(message) {
    errorConsole.textContent = `Error: ${message}`;
    errorConsole.classList.remove('hidden');
  }

  function clearError() {
    errorConsole.textContent = '';
    errorConsole.classList.add('hidden');
  }

  function pulseOutput() {
    outputScreen.classList.remove('screen-active');
    void outputScreen.offsetWidth;
    outputScreen.classList.add('screen-active');
    setTimeout(() => outputScreen.classList.remove('screen-active'), 650);
  }

  function writeOutput(html) {
    outputScreen.srcdoc = html;
    pulseOutput();
  }

  function runHTML(code) { writeOutput(code); }

  function runCSS(code) {
    writeOutput(`<!doctype html><html><head><meta charset="utf-8"><style>${code}</style></head><body><main><h1>CSS Output</h1><p>Your stylesheet is running in the sandbox.</p></main></body></html>`);
  }

  function runJavaScript(code) {
    const safeCode = JSON.stringify(code);
    writeOutput(`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="output"></div><script>
      const output = document.getElementById('output');
      output.style.cssText = 'font:14px/1.6 ui-monospace,monospace;padding:24px;white-space:pre-wrap;color:#111';
      const originalLog = console.log;
      console.log = (...args) => {
        const line = document.createElement('div');
        line.textContent = args.map(value => typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ');
        output.appendChild(line);
        originalLog(...args);
      };
      try {
        new Function(${safeCode})();
      } catch (error) {
        const line = document.createElement('pre');
        line.style.color = '#b00020';
        line.textContent = 'JS Error: ' + error.message;
        output.appendChild(line);
      }
    <\/script></body></html>`);
  }

  function runPython(code) {
    const safeCode = JSON.stringify(code);
    writeOutput(`<!doctype html><html><head><meta charset="utf-8"><script src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"><\/script></head><body><pre id="output" style="font:14px/1.6 ui-monospace,monospace;padding:24px;white-space:pre-wrap">Loading Python runtime...</pre><script>
      const output = document.getElementById('output');
      (async () => {
        try {
          if (typeof loadPyodide !== 'function') throw new Error('Python runtime could not load. Check your internet connection.');
          const pyodide = await loadPyodide();
          const source = ${safeCode};
          let text = '';
          pyodide.setStdout({ batched: value => { text += value + '\\n'; } });
          pyodide.setStderr({ batched: value => { text += value + '\\n'; } });
          await pyodide.runPythonAsync(source);
          output.textContent = text || 'Python code executed successfully.';
        } catch (error) {
          output.textContent = 'Python Error: ' + error.message;
        }
      })();
    <\/script></body></html>`);
  }

  function runCode() {
    clearError();
    runBtn.disabled = true;
    const icon = runBtn.querySelector('span');
    if (icon) icon.textContent = '●';
    try {
      switch (langSelector.value) {
        case 'html': runHTML(editor.value); break;
        case 'css': runCSS(editor.value); break;
        case 'javascript': runJavaScript(editor.value); break;
        case 'python': runPython(editor.value); break;
        default: throw new Error('Unsupported language.');
      }
    } catch (error) {
      showError(error.message || String(error));
    } finally {
      setTimeout(() => {
        runBtn.disabled = false;
        if (icon) icon.textContent = '▶';
      }, 350);
    }
  }

  runBtn.addEventListener('click', runCode);

  editor.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
    }
  });

  langSelector.addEventListener('change', () => {
    editor.value = examples[langSelector.value] || '';
    clearError();
  });

  editor.value = examples[langSelector.value] || examples.html;

  if (rainCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = rainCanvas.getContext('2d');
    let drops = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resetDrop(drop, initial = false) {
      drop.x = Math.random() * width;
      drop.y = initial ? Math.random() * height : -Math.random() * height * 0.25;
      drop.length = 9 + Math.random() * 20;
      drop.speed = 5 + Math.random() * 8;
      drop.opacity = 0.12 + Math.random() * 0.4;
      drop.drift = -0.4 + Math.random() * 0.8;
    }

    function resizeRain() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      rainCanvas.width = width * dpr;
      rainCanvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(240, Math.max(90, Math.floor(width / 6)));
      drops = Array.from({ length: count }, () => ({}));
      drops.forEach(drop => resetDrop(drop, true));
    }

    function animateRain() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.drift, drop.y + drop.length);
        ctx.strokeStyle = `rgba(190,245,255,${drop.opacity})`;
        ctx.stroke();
        drop.y += drop.speed;
        drop.x += drop.drift;
        if (drop.y > height + drop.length) resetDrop(drop);
      });
      requestAnimationFrame(animateRain);
    }

    resizeRain();
    window.addEventListener('resize', resizeRain, { passive: true });
    animateRain();
  }
});