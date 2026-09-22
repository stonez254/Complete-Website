import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});
const db = () => { if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured'); return neon(process.env.DATABASE_URL); };
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex');
const verifyPassword = (password, stored) => {
  if (!stored || !password) return false;
  const parts = stored.split(':'); if (parts.length !== 2) return false;
  const actual = crypto.scryptSync(password, parts[0], 64); const expected = Buffer.from(parts[1], 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
const sessionToken = request => { const raw = request.headers.get('cookie') || ''; const match = raw.match(/(?:^|;\\s*)ederstone_session=([^;]+)/); return match ? decodeURIComponent(match[1]) : null; };
const cookie = token => 'ederstone_session=' + encodeURIComponent(token) + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800';
const clearCookie = 'ederstone_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
async function currentUser(request) {
  const token = sessionToken(request); if (!token) return null;
  const sql = db(); const hash = tokenHash(token);
  const rows = await sql`SELECT u.id, u.display_name, u.username, u.role, u.active FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ${hash} AND s.expires_at > NOW() AND u.active = TRUE LIMIT 1`;
  if (!rows.length) return null;
  await sql`UPDATE sessions SET last_seen_at = NOW() WHERE token_hash = ${hash}`; return rows[0];
}
export async function GET(request) { try { const user = await currentUser(request); return json({ ok:true, authenticated:!!user, user:user || null }); } catch (error) { console.error('Auth check failed:', error?.message || error); return json({ok:false,error:'Authentication service unavailable'},503); } }
export async function POST(request) {
  try {
    const body = await request.json(); const action = body?.action || 'login'; const sql = db();
    if (action === 'logout') { const token=sessionToken(request); if(token) await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash(token)}`; return json({ok:true,authenticated:false},200,{'set-cookie':clearCookie}); }
    if (action !== 'login') return json({ok:false,error:'Unsupported authentication action'},400);
    const username=String(body?.username||'').trim().toLowerCase(); const password=String(body?.password||'');
    if(!username||!password) return json({ok:false,error:'Username and password are required'},400);
    const rows=await sql`SELECT id, display_name, username, role, password_hash, active FROM users WHERE LOWER(username) = ${username} LIMIT 1`; const user=rows[0];
    if(!user||!user.active||!verifyPassword(password,user.password_hash)) return json({ok:false,error:'Invalid credentials'},401);
    const token=crypto.randomBytes(32).toString('base64url');
    await sql`DELETE FROM sessions WHERE user_id = ${user.id} AND expires_at <= NOW()`;
    await sql`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${user.id}, ${tokenHash(token)}, NOW() + INTERVAL '7 days')`;
    return json({ok:true,authenticated:true,user:{id:user.id,display_name:user.display_name,username:user.username,role:user.role}},200,{'set-cookie':cookie(token)});
  } catch(error) { console.error('Auth request failed:',error?.message||error); return json({ok:false,error:'Authentication service unavailable'},503); }
}
export { hashPassword };