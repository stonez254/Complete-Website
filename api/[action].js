import crypto from 'node:crypto';

const SECRET=process.env.PORTFOLIO_AUTH_SECRET;
const ADMIN=process.env.PORTFOLIO_ADMIN_KEY;
const COOKIE='__Host-ederstone_session';

const sign=v=>crypto.createHmac('sha256',SECRET).update(v).digest('base64url');
const random=()=>crypto.randomBytes(5).toString('hex').toUpperCase();

function parseCode(code){
  const m=String(code||'').trim().toUpperCase().match(/^EDR-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]{10})-([A-Z0-9_-]{10})$/);
  return m?{codeExp:parseInt(m[1],36),duration:parseInt(m[2],36),nonce:m[3],sig:m[4]}:null;
}
function session(exp){
  const p=String(exp);
  return Buffer.from(p).toString('base64url')+'.'+sign(p);
}
function body(req){
  return typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
}
function action(req){
  const q=req.query?.action;
  if(typeof q==='string')return q;
  const p=new URL(req.url||'/', 'http://localhost').pathname.split('/').filter(Boolean);
  return p[p.length-1]||'';
}

export default async function handler(req,res){
  const route=action(req);

  if(route==='login'){
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    if(!SECRET)return res.status(503).json({error:'Authentication is not configured.'});
    try{
      const {code}=body(req),p=parseCode(code);
      if(!p||!Number.isFinite(p.codeExp)||!Number.isInteger(p.duration)||p.duration<300||p.duration>604800||p.codeExp<Date.now())
        return res.status(401).json({error:'Invalid or expired access code.'});
      const expected=sign(p.codeExp+'|'+p.duration+'|'+p.nonce).slice(0,10).toUpperCase();
      if(expected.length!==p.sig.length||!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(p.sig)))
        return res.status(401).json({error:'Invalid or expired access code.'});
      const exp=Date.now()+p.duration*1000;
      res.setHeader('Set-Cookie',COOKIE+'='+session(exp)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+p.duration);
      return res.status(200).json({ok:true,sessionExpiresAt:new Date(exp).toISOString(),durationSeconds:p.duration});
    }catch(e){return res.status(400).json({error:'Invalid request.'});}
  }

  if(route==='logout'){
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    return res.status(200).json({ok:true});
  }

  if(route==='session'){
    if(req.method!=='GET')return res.status(405).json({ok:false});
    if(!SECRET)return res.status(503).json({ok:false});
    const raw=req.headers.cookie||'';
    const m=raw.match(new RegExp('(?:^|;\\s*)'+COOKIE.replace(/[-/\\^$*+?.()|[\\]{}]/g,'\\\\$&')+'=([^;]+)'));
    if(!m)return res.status(401).json({ok:false});
    try{
      const [b64,sig]=m[1].split('.');
      const exp=Number(Buffer.from(b64,'base64url').toString());
      const expected=sign(String(exp));
      if(!exp||exp<Date.now()||!sig||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))
        return res.status(401).json({ok:false});
      return res.status(200).json({ok:true,expiresAt:exp});
    }catch(e){return res.status(401).json({ok:false});}
  }

  if(route==='generate-code'){
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    if(!SECRET||!ADMIN)return res.status(503).json({error:'Owner authentication is not configured.'});
    try{
      const {adminKey,durationSeconds}=body(req),supplied=String(adminKey||'');
      if(!supplied||supplied.length!==ADMIN.length||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(ADMIN)))
        return res.status(403).json({error:'Owner key rejected.'});
      const duration=Number(durationSeconds);
      if(!Number.isInteger(duration)||duration<300||duration>604800)
        return res.status(400).json({error:'Duration must be between 5 minutes and 7 days.'});
      const codeExp=Date.now()+7*24*60*60*1000,nonce=random();
      const sig=sign(codeExp+'|'+duration+'|'+nonce).slice(0,10).toUpperCase();
      const code='EDR-'+codeExp.toString(36).toUpperCase()+'-'+duration.toString(36).toUpperCase()+'-'+nonce+'-'+sig;
      return res.status(200).json({code,durationSeconds:duration,codeExpiresAt:new Date(codeExp).toISOString()});
    }catch(e){return res.status(400).json({error:'Invalid request.'});}
  }

  return res.status(404).json({error:'Not found'});
}
