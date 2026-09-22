(() => {
  'use strict';
  const KEY='pos', QUEUE='ederstone-sync-queue-v1';
  let serverVersion=0,syncing=false,suppressPush=false,lastSyncAt=0,lastError=null,queued=false;
  const store=()=>window.EderStoneStore;
  const localState=()=>store()?.get(KEY,null);
  const readQueue=()=>{try{return JSON.parse(localStorage.getItem(QUEUE)||'[]')}catch(_){return[]}};
  const writeQueue=q=>{try{localStorage.setItem(QUEUE,JSON.stringify(q));return true}catch(_){return false}};
  const MAX_QUEUE_ITEMS=5;
  const markQueued=()=>{queued=true;emit()};
  const emit=()=>window.dispatchEvent(new CustomEvent('ederstone:sync-status',{detail:{online:navigator.onLine,synced:serverVersion>0,syncing,queued,queueSize:readQueue().length,lastSyncAt,lastError,serverVersion}}));
  const enqueue=()=>{const state=localState();if(!state)return;const q=readQueue();const serialized=JSON.stringify(state);const normal=q.filter(item=>item.reason!=='version-conflict');const last=normal[normal.length-1];if(last&&JSON.stringify(last.state)===serialized){markQueued();return;}const conflicts=q.filter(item=>item.reason==='version-conflict');const next=[...conflicts,{id:crypto.randomUUID?.()||String(Date.now()),state,createdAt:Date.now()}];const trimmed=next.slice(-MAX_QUEUE_ITEMS);if(!writeQueue(trimmed)){lastError='Unable to persist offline sync queue';}markQueued()};
  const normalPending=()=>readQueue().filter(item=>item.reason!=='version-conflict');

  async function pullInternal(){
    const response=await fetch('/api/pos',{cache:'no-store',credentials:'include'});
    const result=await response.json().catch(()=>({}));
    if(!response.ok||!result.ok)throw new Error(result.error||'Sync pull failed');
    if(result.state&&store()){suppressPush=true;try{store().set(KEY,result.state)}finally{suppressPush=false}}
    serverVersion=Number(result.version||0);lastSyncAt=Date.now();lastError=null;queued=readQueue().length>0;emit();return true;
  }
  async function pull(){
    if(!navigator.onLine||syncing)return false;
    syncing=true;emit();try{return await pullInternal()}catch(e){lastError=e?.message||'Sync pull failed';return false}finally{syncing=false;emit()}
  }
  async function send(state,version){
    const response=await fetch('/api/pos',{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({state,expectedVersion:version||null})});
    const result=await response.json().catch(()=>({}));
    return {response,result};
  }
  async function push(){
    if(!navigator.onLine){if(!readQueue().length)enqueue();else markQueued();return false}
    if(syncing)return false;
    const auth=window.EderStoneAuth;
    if(!auth?.authenticated){lastError='Authentication required before server sync';emit();return false;}
    if(auth.offline){markQueued();lastError='Waiting for trusted server authentication';emit();return false;}
    const local=localState();if(!local)return false;
    syncing=true;lastError=null;emit();
    try{
      const pending=normalPending();
      const batch=pending.length?pending[pending.length-1]:{state:local};
      const sent=await send(batch.state,serverVersion||null);
      if(sent.response.status===409){
        const conflictState=batch.state;
        const conflictQueue=readQueue();
        const pulled=await pullInternal();
        if(pulled){
          const q=readQueue().filter(item=>item.reason==='version-conflict');
          q.push({id:crypto.randomUUID?.()||String(Date.now()),state:conflictState,createdAt:Date.now(),reason:'version-conflict',serverVersion});
          writeQueue(q.slice(-MAX_QUEUE_ITEMS));
        } else {
          writeQueue(conflictQueue.length?conflictQueue:[{id:crypto.randomUUID?.()||String(Date.now()),state:conflictState,createdAt:Date.now(),reason:'version-conflict',serverVersion}]);
        }
        queued=true;
        lastError='Conflict detected; local changes preserved in sync queue';
        emit();
        return false;
      }
      if(!sent.response.ok||!sent.result.ok)throw new Error(sent.result.error||'Sync push failed');
      serverVersion=Number(sent.result.version||serverVersion);lastSyncAt=Date.now();
      const conflicts=readQueue().filter(item=>item.reason==='version-conflict');
      writeQueue(conflicts.slice(-MAX_QUEUE_ITEMS));queued=conflicts.length>0;lastError=null;emit();return true;
    }catch(e){lastError=e?.message||'Sync push failed';if(!readQueue().length)enqueue();else markQueued();return false}
    finally{syncing=false;emit()}
  }
  window.EderStonePOSSync=Object.freeze({pull,push,status:()=>({online:navigator.onLine,synced:serverVersion>0,syncing,queued,queueSize:readQueue().length,lastSyncAt,lastError,serverVersion}),clearQueue:()=>{writeQueue([]);queued=false;emit()}});
  window.addEventListener('offline',()=>{markQueued();});
  window.addEventListener('online',async()=>{
    try{await window.EderStoneAuthSession?.refresh?.();}catch(_){}
    await pull();
    await push();
  });
  window.addEventListener('load',()=>{emit();pull()});
  window.addEventListener('ederstone:state-change',e=>{if(e.detail?.key!==KEY||e.detail?.source==='storage'||suppressPush)return;clearTimeout(window.__ederstoneSyncTimer);window.__ederstoneSyncTimer=setTimeout(push,900)});
})();
