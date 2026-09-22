import { staffApi } from './auth.js';

export default async function handler(req, res) {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers || {})) {
      if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
    }
    const rawBody = ['GET', 'HEAD'].includes(req.method) ? undefined : (
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    );
    const request = new Request('http://localhost/api/staff', {
      method: req.method,
      headers,
      body: rawBody
    });
    const response = await staffApi(request);
    const body = await response.text();
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    return res.send(body);
  } catch (_) {
    return res.status(503).json({ ok: false, error: 'Staff service unavailable' });
  }
}
