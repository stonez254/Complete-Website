import { requirePermission } from '../auth.js';
import https from 'node:https';
import { neon } from '@neondatabase/serverless';

const json=(res,body,status=200)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(body)};
const requestJson=(host,path,body,access)=>new Promise((resolve,reject)=>{
  const req=https.request({hostname:host,path,method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'}},res=>{
    let data='';res.on('data',c=>data+=c);res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(data||'{}')})}catch(_){reject(new Error('Payment provider returned invalid JSON'))}});
  });req.setTimeout(15000,()=>req.destroy(new Error('Payment provider timeout')));req.on('error',reject);req.write(JSON.stringify(body));req.end();
});
const token=()=>{const host=process.env.MPESA_ENV==='production'?'api.safaricom.co.ke':'sandbox.safaricom.co.ke';const auth=Buffer.from(process.env.MPESA_CONSUMER_KEY+':'+process.env.MPESA_CONSUMER_SECRET).toString('base64');return new Promise((resolve,reject)=>{const req=https.request({hostname:host,path:'/oauth/v1/generate?grant_type=client_credentials',method:'GET',headers:{Authorization:'Basic '+auth}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d||'{}');j.access_token?resolve({token:j.access_token,host}):reject(new Error('M-Pesa authentication failed'))}catch(_){reject(new Error('M-Pesa authentication failed'))}})});req.setTimeout(10000,()=>req.destroy(new Error('M-Pesa authentication timeout')));req.on('error',reject);req.end()})};
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,{ok:false,error:'Method not allowed'},405)}
  try{
    const auth=await requirePermission(new Request('http://localhost/api/mpesa/stkpush',{method:'POST',headers:req.headers}),'pos.write');
    if(!auth.ok)return res.status(auth.response.status).json(await auth.response.json());
    const required=['MPESA_CONSUMER_KEY','MPESA_CONSUMER_SECRET','MPESA_SHORTCODE','MPESA_PASSKEY','MPESA_CALLBACK_URL'];
    if(required.some(k=>!process.env[k]))return json(res,{ok:false,error:'M-Pesa service is not configured'},503);
    const raw=JSON.stringify(req.body||{});if(raw.length>8192)return json(res,{ok:false,error:'Request too large'},413);
    const {phone,amount,accountReference='EDERSTONE',transactionDesc='Restaurant payment'}=req.body||{};
    if(typeof phone!=='string'||!/^(?:254|\+254|07|01)\d{8}$/.test(phone))return json(res,{ok:false,error:'Invalid Kenyan M-Pesa phone number'},400);
    const normalized=phone.replace(/^\+/, '').replace(/^0/,'254');
    const value=Number(amount);if(!Number.isSafeInteger(value)||value<1||value>150000)return json(res,{ok:false,error:'Invalid payment amount'},400);
    const reference=String(accountReference).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,12)||'EDERSTONE';
    const description=String(transactionDesc).replace(/[^a-zA-Z0-9 ._-]/g,'').slice(0,13)||'Restaurant payment';
    const {token:access_token,host}=await token();
    const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
    const password=Buffer.from(process.env.MPESA_SHORTCODE+process.env.MPESA_PASSKEY+timestamp).toString('base64');
    const result=await requestJson(host,'/mpesa/stkpush/v1/processrequest',{BusinessShortCode:process.env.MPESA_SHORTCODE,Password:password,Timestamp:timestamp,TransactionType:'CustomerPayBillOnline',Amount:value,PartyA:normalized,PartyB:process.env.MPESA_SHORTCODE,PhoneNumber:normalized,CallBackURL:process.env.MPESA_CALLBACK_URL,AccountReference:reference,TransactionDesc:description},access_token);
    if(result.status<200||result.status>=300||result.data.ResponseCode!=='0')return json(res,{ok:false,error:'M-Pesa STK request was rejected'},400);
    const sql=neon(process.env.DATABASE_URL);
    await sql`INSERT INTO mpesa_transactions (checkout_request_id,merchant_request_id,phone,amount,account_reference,transaction_desc,status,created_by) VALUES (${result.data.CheckoutRequestID},${result.data.MerchantRequestID||null},${normalized},${value},${reference},${description},'pending',${auth.user.id==='legacy-owner'?null:auth.user.id}) ON CONFLICT (checkout_request_id) DO UPDATE SET merchant_request_id=EXCLUDED.merchant_request_id,updated_at=NOW()`;
    return json(res,{ok:true,checkoutRequestID:result.data.CheckoutRequestID,merchantRequestID:result.data.MerchantRequestID,customerMessage:result.data.CustomerMessage});
  }catch(e){console.error('M-Pesa STK request failed:',e?.message||e);return json(res,{ok:false,error:'Payment service unavailable'},503)}
}
