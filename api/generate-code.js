import crypto from 'node:crypto';

const SECRET=process.env.PORTFOLIO_AUTH_SECRET;
const ADMIN=process.env.PORTFOLIO_ADMIN_KEY;

function sign(value){return crypto.createHmac('sha256',SECRET).update(value).digest('base64url')}
function random(){return crypto.randomBytes(5).toString('hex').toUpperCase()}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!SECRET||!ADMIN)return res.status(503).json({error:'Owner authentication is not configured.'});
  try{
    const {adminKey}=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const supplied=String(adminKey||'');
    if(!supplied||supplied.length!==ADMIN.length||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(ADMIN)))return res.status(403).json({error:'Owner key rejected.'});
    const exp=Date.now()+7*24*60*60*1000;
    const nonce=random();
    const sig=sign(exp+'|'+nonce).slice(0,10).toUpperCase();
    const code='EDR-'+exp.toString(36).toUpperCase()+'-'+nonce+'-'+sig;
    return res.status(200).json({code,expiresAt:new Date(exp).toISOString()});
  }catch(e){return res.status(400).json({error:'Invalid request.'})}
}