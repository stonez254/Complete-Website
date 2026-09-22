import { requirePermission } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const request = new Request('http://localhost/api/delivery.read', {
      method: 'GET',
      headers: req.headers
    });
    const auth = await requirePermission(request, 'delivery.read');
    if (!auth.ok) return res.status(auth.response.status).json(await auth.response.json());
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, authorized: true, role: auth.user.role });
  } catch (_) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false, error: 'Authorization service unavailable' });
  }
}
