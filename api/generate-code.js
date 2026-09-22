import crypto from 'node:crypto';
import { currentUser } from './auth.js';

const SECRET=process.env.PORTFOLIO_AUTH_SECRET;
const ADMIN=process.env.PORTFOLIO_ADMIN_KEY;
const CODE_LIFETIME=7*24*60*60*1000;
const sign=v=>crypto.createHmac('sha256',SECRET).update(v).digest('base64url');
const random=()=>crypto.randomBytes(5).toString('hex').toUpperCase();

const attempts=new Map();
function limited(key){
  const now=Date.now(), windowMs=10*60*1000, max=10;
  const list=(attempts.get(key)||[]).filter(t=>now-t<windowMs);
  if(list.length>=max){attempts.set(key,list);return true}
  list.push(now); attempts.set(key,list);
  if(attempts.size>5000) for(const [k,v] of attempts) if(!v.some(t=>now-t<windowMs)) attempts.delete(k);
  return false;
}
function clientKey(req){
  return String(req.headers['x-forwarded-for']||req.headers['x-real-ip']||'unknown').split(',')[0].trim().slice(0,128)||'unknown';
}
async function requestUser(req){
  const headers=new Headers();
  for(const [key,value] of Object.entries(req.headers||{})){
    if(value!==undefined) headers.set(key,Array.isArray(value)?value.join(', '):String(value));
  }
  return currentUser(new Request('http://localhost/api/generate-code',{method:'GET',headers}));
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!SECRET)return res.status(503).json({error:'Owner authentication is not configured.'});
  if(limited(clientKey(req)))return res.status(429).json({error:'Too many attempts. Please try again later.'});
  try{
    const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
    if(raw.length>8192)return res.status(413).json({error:'Request too large.'});
    let body;
    try{body=raw?JSON.parse(raw):{}}catch(_){return res.status(400).json({error:'Invalid JSON.'})}

    let authorized=false;
    const user=await requestUser(req).catch(()=>null);
    if(user?.active&&user.role==='owner') authorized=true;

    if(!authorized&&ADMIN){
      const supplied=String(body?.adminKey||'');
      if(supplied&&supplied.length===ADMIN.length){
        const a=Buffer.from(supplied),b=Buffer.from(ADMIN);
        authorized=a.length===b.length&&crypto.timingSafeEqual(a,b);
      }
    }
    if(!authorized)return res.status(403).json({error:'Owner authentication required.'});

    const duration=Number(body?.durationSeconds);
    if(!Number.isInteger(duration)||duration<300||duration>604800)return res.status(400).json({error:'Duration must be between 5 minutes and 7 days.'});

    const codeExp=Date.now()+CODE_LIFETIME;
    const nonce=random();
    const sig=sign(codeExp+'|'+duration+'|'+nonce).slice(0,10).toUpperCase();
    const code='EDR-'+codeExp.toString(36).toUpperCase()+'-'+duration.toString(36).toUpperCase()+'-'+nonce+'-'+sig;
    return res.status(200).json({code,durationSeconds:duration,codeExpiresAt:new Date(codeExp).toISOString()});
  }catch(e){
    console.error('Access-code generation failed');
    return res.status(503).json({error:'Owner authentication service unavailable.'});
  }
}