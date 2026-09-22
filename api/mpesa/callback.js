import { neon } from '@neondatabase/serverless';

const json=(res,body,status=200)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(body)};

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,{ok:false,error:'Method not allowed'},405)}
  try{
    const raw=JSON.stringify(req.body||{});
    if(raw.length>32768)return json(res,{ok:false,error:'Request too large'},413);
    const body=req.body?.Body?.stkCallback;
    const checkoutRequestID=body?.CheckoutRequestID;
    const merchantRequestID=body?.MerchantRequestID;
    const resultCode=body?.ResultCode;
    const resultDesc=body?.ResultDesc;
    if(typeof checkoutRequestID!=='string'||!/^[A-Za-z0-9_-]{10,100}$/.test(checkoutRequestID))return json(res,{ok:false,error:'Invalid callback'},400);
    if(!Number.isInteger(resultCode))return json(res,{ok:false,error:'Invalid callback result'},400);
    const sql=neon(process.env.DATABASE_URL);
    const metadata=Array.isArray(body?.CallbackMetadata?.Item)?body.CallbackMetadata.Item:[];
    const value=name=>metadata.find(item=>item?.Name===name)?.Value;
    const receipt=value('MpesaReceiptNumber');
    const amount=value('Amount');
    const phone=value('PhoneNumber');
    const incomingStatus=resultCode===0?'success':'failed';
    const stored=await sql`SELECT amount,status FROM mpesa_transactions WHERE checkout_request_id=${checkoutRequestID} LIMIT 1`;
    if(!stored.length)return json(res,{ResultCode:0,ResultDesc:'Accepted'});
    const storedAmount=Number(stored[0].amount||0);
    const callbackAmount=Number(amount||0);
    const amountMissing=incomingStatus==='success'&&(!Number.isSafeInteger(callbackAmount)||callbackAmount<=0); const amountMismatch=incomingStatus==='success'&&(amountMissing||callbackAmount!==storedAmount);
    const status=amountMismatch?'failed':(stored[0].status==='success'?'success':incomingStatus);
    const safeMessage=amountMismatch?(amountMissing?'Payment callback did not include a valid amount':'Payment amount mismatch with the requested STK amount'):String(resultDesc||'');
    const reference=metadata.length?String(value('AccountReference')||''):'';
    const rows=await sql`
      UPDATE mpesa_transactions
      SET status=${status},
          merchant_request_id=COALESCE(${merchantRequestID||null},merchant_request_id),
          result_code=${String(resultCode)},
          result_message=${safeMessage},
          mpesa_receipt=COALESCE(${receipt?String(receipt):null},mpesa_receipt),
          amount=amount,
          phone=COALESCE(${phone?String(phone):null},phone),
          updated_at=NOW(),
          completed_at=NOW()
      WHERE checkout_request_id=${checkoutRequestID}
      RETURNING id,status
    `;
    if(!rows.length)return json(res,{ok:false,error:'Transaction not found'},404);
    return json(res,{ResultCode:0,ResultDesc:'Accepted'});
  }catch(e){
    console.error('M-Pesa callback failed:',e?.message||e);
    return json(res,{ResultCode:1,ResultDesc:'Callback processing failed'},503);
  }
}
