import { requirePermission } from '../auth.js';
import https from 'node:https';
import { neon } from '@neondatabase/serverless';

const json=(res,body,status=200)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(body)};
const token=()=>{const host=process.env.MPESA_ENV==='production'?'api.safaricom.co.ke':'sandbox.safaricom.co.ke';const auth=Buffer.from(process.env.MPESA_CONSUMER_KEY+':'+process.env.MPESA_CONSUMER_SECRET).toString('base64');return new Promise((resolve,reject)=>{const req=https.request({hostname:host,path:'/oauth/v1/generate?grant_type=client_credentials',headers:{Authorization:'Basic '+auth}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d||'{}');j.access_token?resolve({token:j.access_token,host}):reject(new Error('M-Pesa authentication failed'))}catch(_){reject(new Error('M-Pesa authentication failed'))}})});req.setTimeout(10000,()=>req.destroy(new Error('M-Pesa authentication timeout')));req.on('error',reject);req.end()})};
const post=(host,path,body,access)=>new Promise((resolve,reject)=>{const r=https.request({hostname:host,path,method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(d||'{}')})}catch(_){reject(new Error('Payment provider returned invalid JSON'))}})});r.setTimeout(15000,()=>r.destroy(new Error('Payment provider timeout')));r.on('error',reject);r.write(JSON.stringify(body));r.end()});
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,{ok:false,error:'Method not allowed'},405)}
  try{
    const auth=await requirePermission(new Request('http://localhost/api/mpesa/query',{method:'POST',headers:req.headers}),'pos.read');
    if(!auth.ok)return res.status(auth.response.status).json(await auth.response.json());
    if(!process.env.MPESA_CONSUMER_KEY||!process.env.MPESA_CONSUMER_SECRET||!process.env.MPESA_SHORTCODE||!process.env.MPESA_PASSKEY)return json(res,{ok:false,error:'M-Pesa service is not configured'},503);
    const raw=JSON.stringify(req.body||{});if(raw.length>4096)return json(res,{ok:false,error:'Request too large'},413);
    const {checkoutRequestID}=req.body||{};
    if(typeof checkoutRequestID!=='string'||!/^[A-Za-z0-9_-]{10,100}$/.test(checkoutRequestID))return json(res,{ok:false,error:'Invalid CheckoutRequestID'},400);
    const {token:access_token,host}=await token();
    const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
    const password=Buffer.from(process.env.MPESA_SHORTCODE+process.env.MPESA_PASSKEY+timestamp).toString('base64');
    const r=await post(host,'/mpesa/stkpushquery/v1/query',{BusinessShortCode:process.env.MPESA_SHORTCODE,Password:password,Timestamp:timestamp,CheckoutRequestID:checkoutRequestID},access_token);
    if(r.status<200||r.status>=300)return json(res,{ok:false,error:'Payment query failed'},502);
    const code=r.data.ResultCode;
    if(code===undefined)return json(res,{status:'pending',message:'Payment pending'});
    const status=String(code)==='0'?'success':'failed';
    const sql=neon(process.env.DATABASE_URL);
    await sql`UPDATE mpesa_transactions SET status=${status},result_code=${String(code)},result_message=${String(r.data.ResultDesc||r.data.ResponseDescription||'')},updated_at=NOW(),completed_at=NOW() WHERE checkout_request_id=${checkoutRequestID}`;
    if(status==='success')return json(res,{status:'success',message:'Payment received'});
    return json(res,{status:'failed',message:'Payment cancelled or failed'});
  }catch(e){console.error('M-Pesa query failed:',e?.message||e);return json(res,{ok:false,error:'Payment service unavailable'},503)}
}
