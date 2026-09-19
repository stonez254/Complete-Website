document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('owner-form');
  const keyInput = document.getElementById('admin-key');
  const status = document.getElementById('owner-status');
  const button = document.getElementById('generate-button');
  const result = document.getElementById('owner-result');
  const codeEl = document.getElementById('generated-code');
  const expiryEl = document.getElementById('generated-expiry');
  const copyButton = document.getElementById('copy-code');
  const againButton = document.getElementById('generate-again');

  if (!form || !keyInput || !status || !button) return;

  async function generate() {
    const adminKey = keyInput.value.trim();

    if (!adminKey) {
      status.className = 'auth-status error';
      status.textContent = 'Enter your owner key first.';
      keyInput.focus();
      return;
    }

    button.disabled = true;
    button.querySelector('span').textContent = 'GENERATING…';
    status.className = 'auth-status';
    status.textContent = 'Connecting to secure generator…';
    result.style.display = 'none';

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ adminKey })
      });

      const raw = await response.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch (_) {}

      if (!response.ok) {
        status.className = 'auth-status error';
        status.textContent =
          data.error ||
          (response.status === 404 ? 'Generator API was not found. The deployment may still be updating.' :
           response.status === 503 ? 'Vercel environment variables are not available to this deployment.' :
           'The generator rejected the request.');
        return;
      }

      if (!data.code) {
        status.className = 'auth-status error';
        status.textContent = 'The server responded, but no access code was returned.';
        return;
      }

      codeEl.textContent = data.code;
      expiryEl.textContent = 'Expires ' + new Date(data.expiresAt).toLocaleString();
      result.style.display = 'block';
      status.className = 'auth-status';
      status.style.color = '#62ffb0';
      status.textContent = 'Code generated successfully.';
    } catch (error) {
      status.className = 'auth-status error';
      status.textContent = 'Connection error. Refresh the page and try again.';
    } finally {
      button.disabled = false;
      button.querySelector('span').textContent = 'GENERATE CODE';
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    generate();
  });

  againButton?.addEventListener('click', generate);

  copyButton?.addEventListener('click', async () => {
    if (!codeEl.textContent) return;
    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      copyButton.textContent = 'COPIED ✓';
      setTimeout(() => { copyButton.textContent = 'COPY CODE'; }, 1500);
    } catch (_) {
      status.textContent = 'Copy failed. Press and hold the code to copy it.';
    }
  });
});