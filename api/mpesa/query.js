const https=require('https');
function token(){
  const host=process.env.MPESA_ENV==='production'?'api.safaricom.co.ke':'sandbox.safaricom.co.ke';
  const auth=Buffer.from(process.env.MPESA_CONSUMER_KEY+':'+process.env.MPESA_CONSUMER_SECRET).toString('base64');
  return new Promise((resolve,reject)=>{const r=https.request({hostname:host,path:'/oauth/v1/generate?grant_type=client_credentials',headers:{Authorization:'Basic '+auth}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);j.access_token?resolve({token:j.access_token,host}):reject(new Error(j.errorMessage||'Token failed'))}catch(e){reject(e)}})});r.on('error',reject);r.end()});
}
function post(host,path,body,access){return new Promise((resolve,reject)=>{const r=https.request({hostname:host,path,method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(d||'{}')})}catch(e){reject(e)}})});r.on('error',reject);r.write(JSON.stringify(body));r.end()})}
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  try{
    const {checkoutRequestID}=req.body||{};if(!checkoutRequestID)return res.status(400).json({error:'CheckoutRequestID required'});
    const {token:access_token,host}=await token();
    const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
    const password=Buffer.from(process.env.MPESA_SHORTCODE+process.env.MPESA_PASSKEY+timestamp).toString('base64');
    const r=await post(host,'/mpesa/stkpushquery/v1/query',{BusinessShortCode:process.env.MPESA_SHORTCODE,Password:password,Timestamp:timestamp,CheckoutRequestID:checkoutRequestID},access_token);
    const code=r.data.ResultCode;
    if(code===undefined)return res.status(200).json({status:'pending',message:r.data.ResponseDescription||'Payment pending'});
    if(String(code)==='0')return res.status(200).json({status:'success',message:'Payment received'});
    return res.status(200).json({status:'failed',message:r.data.ResultDesc||'Payment cancelled or failed'});
  }catch(e){res.status(500).json({error:e.message||'Payment query failed'})}
};