document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  const langSelector = document.getElementById('language-selector');
  const runBtn = document.getElementById('run-btn');
  const outputScreen = document.getElementById('output-screen');
  const errorConsole = document.getElementById('error-console');

  if (!editor || !langSelector || !runBtn || !outputScreen || !errorConsole) return;

  document.body.style.transition = 'opacity 0.25s ease';
  document.body.style.opacity = '1';

  const examples = {
    html: '<main>\n  <h1>Hello, Ederstone.</h1>\n  <p>Build something useful.</p>\n</main>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  background: #111;\n  color: #fff;\n}\nh1 { letter-spacing: -0.04em; }',
    javascript: 'const message = "Code executed successfully!";\nconsole.log(message);\ndocument.body.innerHTML += `<p>${message}</p>`;',
    python: 'print("Hello from Python")\n\nfor n in range(5):\n    print(n)'
  };

  function showError(message) {
    errorConsole.textContent = `Error: ${message}`;
    errorConsole.classList.remove('hidden');
  }

  function clearError() {
    errorConsole.textContent = '';
    errorConsole.classList.add('hidden');
  }

  function writeOutput(documentText) {
    const doc = outputScreen.contentDocument;
    doc.open();
    doc.write(documentText);
    doc.close();
  }

  function runCode() {
    clearError();
    const code = editor.value;
    const language = langSelector.value;

    try {
      if (language === 'html') {
        writeOutput(code);
        return;
      }

      if (language === 'css') {
        writeOutput(`<!doctype html><html><head><meta charset="utf-8"><style>${code}</style></head><body><h1>CSS Output</h1><p>Your CSS is running in the sandbox.</p></body></html>`);
        return;
      }

      if (language === 'javascript') {
        const encoded = encodeURIComponent(code);
        writeOutput(`<!doctype html><html><body><div id="output"></div><script>
          const output = document.getElementById('output');
          const originalLog = console.log;
          console.log = (...args) => {
            const line = document.createElement('div');
            line.textContent = args.map(String).join(' ');
            output.appendChild(line);
            originalLog(...args);
          };
          try {
            const source = decodeURIComponent('${encoded}');
            new Function(source)();
          } catch (error) {
            const line = document.createElement('pre');
            line.textContent = 'JS Error: ' + error.message;
            output.appendChild(line);
          }
        <\/script></body></html>`);
        return;
      }

      if (language === 'python') {
        const encoded = encodeURIComponent(code);
        writeOutput(`<!doctype html><html><head><meta charset="utf-8"><script src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"><\/script></head><body><pre id="output">Loading Python runtime...</pre><script>
          const output = document.getElementById('output');
          (async () => {
            try {
              const pyodide = await loadPyodide();
              const source = decodeURIComponent('${encoded}');
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
        return;
      }

      showError('Unsupported language.');
    } catch (error) {
      showError(error.message);
    }
  }

  runBtn.addEventListener('click', runCode);

  editor.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
  });

  langSelector.addEventListener('change', () => {
    editor.value = examples[langSelector.value] || '';
    clearError();
  });

  editor.value = examples[langSelector.value] || examples.html;
});