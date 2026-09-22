import { neon } from '@neondatabase/serverless';
import { requirePermission } from '../auth.js';

const json=(res,body,status=200)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(body)};

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,{ok:false,error:'Method not allowed'},405)}
  try{
    const auth=await requirePermission(new Request('http://localhost/api/mpesa/settle',{method:'POST',headers:req.headers}),'pos.write');
    if(!auth.ok)return res.status(auth.response.status).json(await auth.response.json());
    const raw=JSON.stringify(req.body||{});
    if(raw.length>4096)return json(res,{ok:false,error:'Request too large'},413);
    const {checkoutRequestID,posOrderId,amount}=req.body||{};
    if(typeof checkoutRequestID!=='string'||!/^[A-Za-z0-9_-]{10,100}$/.test(checkoutRequestID))return json(res,{ok:false,error:'Invalid CheckoutRequestID'},400);
    if(typeof posOrderId!=='string'||!/^[A-Za-z0-9_-]{6,80}$/.test(posOrderId))return json(res,{ok:false,error:'Invalid POS order ID'},400);
    const expectedAmount=Number(amount);
    if(!Number.isSafeInteger(expectedAmount)||expectedAmount<1||expectedAmount>150000)return json(res,{ok:false,error:'Invalid payment amount'},400);
    const sql=neon(process.env.DATABASE_URL);
    const txRows=await sql`SELECT checkout_request_id,pos_order_id,amount,status,mpesa_receipt FROM mpesa_transactions WHERE checkout_request_id=${checkoutRequestID} LIMIT 1`;
    if(!txRows.length)return json(res,{ok:false,error:'Payment transaction not found'},404);
    const tx=txRows[0];
    if(tx.status!=='success')return json(res,{ok:false,error:'Payment is not confirmed'},409);
    if(Number(tx.amount)!==expectedAmount)return json(res,{ok:false,error:'Payment amount does not match the sale'},409);
    if(tx.pos_order_id&&tx.pos_order_id!==posOrderId)return json(res,{ok:false,error:'Payment is already linked to another sale'},409);
    const existing=await sql`SELECT pos_order_id,amount,settled_at FROM pos_payment_settlements WHERE checkout_request_id=${checkoutRequestID} OR pos_order_id=${posOrderId} LIMIT 1`;
    if(existing.length){const row=existing[0];if(row.pos_order_id!==posOrderId)return json(res,{ok:false,error:'Sale ID is already linked to another payment'},409);return json(res,{ok:true,alreadySettled:true,posOrderId,amount:Number(row.amount),settledAt:row.settled_at})}
    const actorId=auth.user.legacy?'':auth.user.id;
    const rows=await sql`WITH linked AS (UPDATE mpesa_transactions SET pos_order_id=${posOrderId},updated_at=NOW() WHERE checkout_request_id=${checkoutRequestID} AND status='success' AND amount=${expectedAmount} AND (pos_order_id IS NULL OR pos_order_id=${posOrderId}) RETURNING checkout_request_id,amount,mpesa_receipt), settled AS (INSERT INTO pos_payment_settlements(checkout_request_id,pos_order_id,amount,settled_by) SELECT checkout_request_id,pos_order_id,amount,${actorId||null} FROM linked ON CONFLICT (checkout_request_id) DO NOTHING RETURNING pos_order_id,amount,settled_at) SELECT pos_order_id,amount,settled_at,mpesa_receipt FROM settled`;
    if(!rows.length){const again=await sql`SELECT pos_order_id,amount,settled_at FROM pos_payment_settlements WHERE checkout_request_id=${checkoutRequestID} OR pos_order_id=${posOrderId} LIMIT 1`;if(again.length&&again[0].pos_order_id===posOrderId)return json(res,{ok:true,alreadySettled:true,posOrderId,amount:Number(again[0].amount),settledAt:again[0].settled_at});return json(res,{ok:false,error:'Payment settlement conflict'},409)}
    return json(res,{ok:true,alreadySettled:false,posOrderId,amount:Number(rows[0].amount),mpesaReceipt:rows[0].mpesa_receipt||null,settledAt:rows[0].settled_at});
  }catch(e){console.error('M-Pesa settlement failed:',e?.message||e);return json(res,{ok:false,error:'Payment settlement unavailable'},503)}
}