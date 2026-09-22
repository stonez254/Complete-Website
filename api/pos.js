import { neon } from '@neondatabase/serverless';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export async function GET() {
  try {
    const sql = database();
    const rows = await sql\`SELECT data, version, updated_at FROM pos_state WHERE id = 1 LIMIT 1\`;
    if (!rows.length) return json({ ok: true, state: null, version: 0 });
    return json({ ok: true, state: rows[0].data, version: Number(rows[0].version), updatedAt: rows[0].updated_at });
  } catch (error) {
    console.error('POS database request failed:', error?.message || error);
    return json({ ok: false, error: 'Database unavailable' }, 503);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body || typeof body.state !== 'object' || Array.isArray(body.state)) {
      return json({ ok: false, error: 'state must be an object' }, 400);
    }
    const sql = database();
    const state = JSON.stringify(body.state);
    const expectedVersion = Number.isFinite(Number(body.expectedVersion)) ? Number(body.expectedVersion) : null;

    const rows = expectedVersion === null
      ? await sql\`
          INSERT INTO pos_state (id, data, version, updated_at)
          VALUES (1, \${state}::jsonb, 1, NOW())
          ON CONFLICT (id) DO UPDATE
          SET data = EXCLUDED.data, version = pos_state.version + 1, updated_at = NOW()
          RETURNING version, updated_at
        \`
      : await sql\`
          UPDATE pos_state
          SET data = \${state}::jsonb, version = version + 1, updated_at = NOW()
          WHERE id = 1 AND version = \${expectedVersion}
          RETURNING version, updated_at
        \`;

    if (!rows.length) return json({ ok: false, error: 'Version conflict', conflict: true }, 409);
    return json({ ok: true, version: Number(rows[0].version), updatedAt: rows[0].updated_at });
  } catch (error) {
    return json({ ok: false, error: error?.message || 'Database unavailable' }, 503);
  }
}
