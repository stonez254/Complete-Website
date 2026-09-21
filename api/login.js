import crypto from 'node:crypto';

const SECRET=process.env.PORTFOLIO_AUTH_SECRET;
const COOKIE='__Host-ederstone_session';

function sign(value){return crypto.createHmac('sha256',SECRET).update(value).digest('base64url')}

function parseCode(code){
  const value=String(code||'').trim().toUpperCase();
  const m=value.match(/^EDR-([A-Z0-9]+)-([A-Z0-9]{10})-([A-Z0-9_-]{10})$/);
  if(!m)return null;
  return{exp:parseInt(m[1],36),nonce:m[2],sig:m[3]};
}

function session(exp){
  const p=String(exp);
  return Buffer.from(p).toString('base64url')+'.'+sign(p);
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!SECRET)return res.status(503).json({error:'Authentication is not configured.'});

  try{
    const {code}=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const p=parseCode(code);

    if(!p||!p.exp||p.exp<Date.now()){
      return res.status(401).json({error:'Invalid or expired access code.'});
    }

    const expected=sign(p.exp+'|'+p.nonce).slice(0,10).toUpperCase();

    if(expected.length!==p.sig.length||!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(p.sig))){
      return res.status(401).json({error:'Invalid or expired access code.'});
    }

    const SESSION_SECONDS=180;
    const token=session(Date.now()+SESSION_SECONDS*1000);
    res.setHeader('Set-Cookie',COOKIE+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+SESSION_SECONDS);
    return res.status(200).json({ok:true});
  }catch(e){
    return res.status(400).json({error:'Invalid request.'});
  }
}