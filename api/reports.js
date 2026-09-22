import { requirePermission } from './auth.js';
import { neon } from '@neondatabase/serverless';

const json=(res,body,status=200)=>{
  res.setHeader('Cache-Control','no-store');
  return res.status(status).json(body);
};

export default async function handler(req,res){
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return json(res,{ok:false,error:'Method not allowed'},405);
  }
  try{
    const auth=await requirePermission(new Request('http://localhost/api/reports.read',{method:'GET',headers:req.headers}),'reports.read');
    if(!auth.ok)return res.status(auth.response.status).json(await auth.response.json());
    if(auth.user.role!=='owner'&&auth.user.role!=='manager')return json(res,{ok:false,error:'Forbidden'},403);

    const sql=neon(process.env.DATABASE_URL);
    const url=new URL(req.url,'http://localhost');
    const limit=Math.min(Math.max(Number(url.searchParams.get('limit')||50),1),100);

    const [audit, payments, settlements] = await Promise.all([
      sql`SELECT id,event_type,payload,actor_user_id,created_at FROM pos_events ORDER BY created_at DESC,id DESC LIMIT ${limit}`,
      sql`SELECT checkout_request_id,merchant_request_id,pos_order_id,phone,amount,status,result_code,result_message,mpesa_receipt,created_at,updated_at,completed_at
           FROM mpesa_transactions ORDER BY created_at DESC LIMIT ${limit}`,
      sql`SELECT s.checkout_request_id,s.pos_order_id,s.amount,s.settled_at,s.settled_by,m.mpesa_receipt
           FROM pos_payment_settlements s
           LEFT JOIN mpesa_transactions m ON m.checkout_request_id=s.checkout_request_id
           ORDER BY s.settled_at DESC LIMIT ${limit}`
    ]);

    const paymentSummary=payments.reduce((a,p)=>{
      a.total++;
      a[p.status]=(a[p.status]||0)+1;
      if(p.status==='success')a.successAmount+=Number(p.amount||0);
      return a;
    },{total:0,pending:0,success:0,failed:0,successAmount:0});

    const settledIds=new Set(settlements.map(x=>x.checkout_request_id));
    const unmatched=payments.filter(p=>p.status==='success'&&!settledIds.has(p.checkout_request_id));
    return json(res,{ok:true,audit,payments,settlements,unmatched,paymentSummary});
  }catch(error){
    console.error('Reports request failed:',error?.message||error);
    return json(res,{ok:false,error:'Reports unavailable'},503);
  }
}
