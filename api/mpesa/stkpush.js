const https = require('https');

function requestJson(url, options, body){
  return new Promise((resolve,reject)=>{
    const req=https.request(url,options,res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(data||'{}')})}catch(e){reject(new Error('Safaricom returned invalid JSON'))}})});
    req.on('error',reject);req.write(JSON.stringify(body));req.end();
  });
}
function token(){
  const env=process.env.MPESA_ENV==='production';
  const host=env?'api.safaricom.co.ke':'sandbox.safaricom.co.ke';
  const auth=Buffer.from(process.env.MPESA_CONSUMER_KEY+':'+process.env.MPESA_CONSUMER_SECRET).toString('base64');
  return new Promise((resolve,reject)=>{
    const req=https.request({hostname:host,path:'/oauth/v1/generate?grant_type=client_credentials',method:'GET',headers:{Authorization:'Basic '+auth}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);j.access_token?resolve({token:j.access_token,host}):reject(new Error(j.errorMessage||'Could not get Daraja token'))}catch(e){reject(e)}})});
    req.on('error',reject);req.end();
  });
}
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  const required=['MPESA_CONSUMER_KEY','MPESA_CONSUMER_SECRET','MPESA_SHORTCODE','MPESA_PASSKEY','MPESA_CALLBACK_URL'];
  const missing=required.filter(k=>!process.env[k]);if(missing.length)return res.status(500).json({error:'Missing Vercel environment variables: '+missing.join(', ')});
  try{
    const {phone,amount,accountReference='EDERSTONE',transactionDesc='Restaurant payment'}=req.body||{};
    if(!/^254[17]\d{8}$/.test(phone))return res.status(400).json({error:'Invalid Kenyan M-Pesa phone number'});
    const value=Math.max(1,Math.round(Number(amount)||0));if(!value)return res.status(400).json({error:'Invalid amount'});
    const {token:access_token,host}=await token();
    const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
    const password=Buffer.from(process.env.MPESA_SHORTCODE+process.env.MPESA_PASSKEY+timestamp).toString('base64');
    const result=await requestJson('https://'+host+'/mpesa/stkpush/v1/processrequest',{hostname:host,path:'/mpesa/stkpush/v1/processrequest',method:'POST',headers:{Authorization:'Bearer '+access_token,'Content-Type':'application/json'}},{BusinessShortCode:process.env.MPESA_SHORTCODE,Password:password,Timestamp:timestamp,TransactionType:'CustomerPayBillOnline',Amount:value,PartyA:phone,PartyB:process.env.MPESA_SHORTCODE,PhoneNumber:phone,CallBackURL:process.env.MPESA_CALLBACK_URL,AccountReference:String(accountReference).slice(0,12),TransactionDesc:String(transactionDesc).slice(0,13)});
    if(result.status<200||result.status>=300||result.data.ResponseCode!=='0')return res.status(400).json({error:result.data.errorMessage||result.data.ResponseDescription||'M-Pesa STK request was rejected'});
    res.status(200).json({ok:true,checkoutRequestID:result.data.CheckoutRequestID,merchantRequestID:result.data.MerchantRequestID,customerMessage:result.data.CustomerMessage});
  }catch(e){res.status(500).json({error:e.message||'M-Pesa service error'})}
};