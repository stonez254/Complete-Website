import { requirePermission } from './auth.js';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const request = new Request('http://localhost/api/reports.read', {
      method: 'GET',
      headers: req.headers
    });
    const auth = await requirePermission(request, 'reports.read');
    if (!auth.ok) return res.status(auth.response.status).json(await auth.response.json());
    if (auth.user.role !== 'owner' && auth.user.role !== 'manager') {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    const sql = neon(process.env.DATABASE_URL);
    const url = new URL(req.url, 'http://localhost');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 50), 1), 100);
    const rows = await sql`
      SELECT id, event_type, payload, actor_user_id, created_at
      FROM pos_events
      ORDER BY created_at DESC, id DESC
      LIMIT ${limit}
    `;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, audit: rows });
  } catch (_) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false, error: 'Authorization service unavailable' });
  }
}
