import { requirePermission } from './auth.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

export default async function handler(req, res) {
  try {
    const request = new Request('http://localhost/api/menu.js', {
      method: req.method,
      headers: req.headers
    });
    const auth = await requirePermission(request, 'menu.manage');
    if (!auth.ok) return res.status(auth.response.status).json(await auth.response.json());
    return res.status(200).json({ ok: true, authorized: true, role: auth.user.role });
  } catch (_) {
    return res.status(503).json({ ok: false, error: 'Authorization service unavailable' });
  }
}
