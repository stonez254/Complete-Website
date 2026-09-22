import { neon } from '@neondatabase/serverless';
import { currentUser } from './auth.js';

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
function database(){const url=process.env.DATABASE_URL;if(!url)throw new Error('DATABASE_URL is not configured');return neon(url);}
function hasPermission(user,p){return user?.role==='owner'||(user?.role==='manager'&&['pos.read','pos.write'].includes(p));}

export async function GET(request){
  try{
    const user=await currentUser(request);
    if(!user||!hasPermission(user,'pos.read'))return json({ok:false,error:'Forbidden'},403);
    const sql=database();
    const rows=await sql`SELECT data, version, updated_at FROM pos_state WHERE id=1 LIMIT 1`;
    if(!rows.length)return json({ok:true,state:null,version:0});
    return json({ok:true,state:rows[0].data,version:Number(rows[0].version),updatedAt:rows[0].updated_at});
  }catch(error){
    console.error('POS database request failed:',error?.message||error);
    return json({ok:false,error:'Database unavailable'},503);
  }
}

export async function PUT(request){
  try{
    const user=await currentUser(request);
    if(!user||!hasPermission(user,'pos.write'))return json({ok:false,error:'Forbidden'},403);
    const raw=await request.text();
    if(raw.length>2_000_000)return json({ok:false,error:'Request too large'},413);
    let body;try{body=JSON.parse(raw)}catch(_){return json({ok:false,error:'Invalid JSON'},400)}
    if(!body||typeof body.state!=='object'||Array.isArray(body.state))return json({ok:false,error:'state must be an object'},400);
    const state=JSON.stringify(body.state);
    if(state.length>1_500_000)return json({ok:false,error:'POS state too large'},413);

    const hasExpectedVersion=body.expectedVersion!==undefined&&body.expectedVersion!==null&&body.expectedVersion!=='';
    const parsedExpectedVersion=Number(body.expectedVersion);
    if(hasExpectedVersion&&(!Number.isSafeInteger(parsedExpectedVersion)||parsedExpectedVersion<0))return json({ok:false,error:'Invalid expectedVersion'},400);
    const expectedVersion=hasExpectedVersion?parsedExpectedVersion:null;
    const sql=database();

    if(expectedVersion===null){
      const rows=await sql`
        WITH inserted AS (
          INSERT INTO pos_state(id,data,version,updated_at)
          VALUES(1,${state}::jsonb,1,NOW())
          ON CONFLICT(id) DO NOTHING
          RETURNING version,updated_at
        ),
        logged AS (
          INSERT INTO pos_events(event_type,payload,actor_user_id)
          SELECT 'pos.state.created', jsonb_build_object('version',version,'source','api'), ${user.legacy?null:user.id}::uuid
          FROM inserted
          RETURNING 1
        )
        SELECT version,updated_at FROM inserted
      `;
      if(!rows.length){
        const current=await sql`SELECT version FROM pos_state WHERE id=1 LIMIT 1`;
        return json({ok:false,error:'POS state was initialized concurrently',conflict:true,version:Number(current[0]?.version||0)},409);
      }
      return json({ok:true,version:Number(rows[0].version),updatedAt:rows[0].updated_at});
    }

    const rows=await sql`
      WITH updated AS (
        UPDATE pos_state
        SET data=${state}::jsonb,version=version+1,updated_at=NOW()
        WHERE id=1 AND version=${expectedVersion}
        RETURNING version,updated_at
      ),
      logged AS (
        INSERT INTO pos_events(event_type,payload,actor_user_id)
        SELECT 'pos.state.updated', jsonb_build_object('version',version,'expectedVersion',${expectedVersion},'source','api'), ${user.legacy?null:user.id}::uuid
        FROM updated
        RETURNING 1
      )
      SELECT version,updated_at FROM updated
    `;
    if(!rows.length){
      const current=await sql`SELECT version,updated_at FROM pos_state WHERE id=1 LIMIT 1`;
      return json({ok:false,error:'Version conflict',conflict:true,version:Number(current[0]?.version||0),updatedAt:current[0]?.updated_at||null},409);
    }
    return json({ok:true,version:Number(rows[0].version),updatedAt:rows[0].updated_at});
  }catch(error){
    console.error('POS database request failed:',error?.message||error);
    return json({ok:false,error:'Database unavailable'},503);
  }
}
