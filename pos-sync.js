(() => {
  'use strict';
  const KEY='pos', QUEUE='ederstone-sync-queue-v1';
  let serverVersion=0,syncing=false,suppressPush=false,lastSyncAt=0,lastError=null,queued=false;
  const store=()=>window.EderStoneStore;
  const localState=()=>store()?.get(KEY,null);
  const readQueue=()=>{try{return JSON.parse(localStorage.getItem(QUEUE)||'[]')}catch(_){return[]}};
  const writeQueue=q=>{try{localStorage.setItem(QUEUE,JSON.stringify(q));return true}catch(_){return false}};
  const markQueued=()=>{queued=true;emit()};
  const emit=()=>window.dispatchEvent(new CustomEvent('ederstone:sync-status',{detail:{online:navigator.onLine,synced:serverVersion>0,syncing,queued,queueSize:readQueue().length,lastSyncAt,lastError,serverVersion}}));
  const enqueue=()=>{const state=localState();if(!state)return;const q=readQueue();q.push({id:crypto.randomUUID?.()||String(Date.now()),state,createdAt:Date.now()});writeQueue(q);markQueued()};

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
    const local=localState();if(!local)return false;
    syncing=true;lastError=null;emit();
    try{
      const pending=readQueue();
      const batch=pending.length?pending[pending.length-1]:{state:local};
      const sent=await send(batch.state,serverVersion||null);
      if(sent.response.status===409){await pullInternal();lastError='Conflict detected; server state restored locally';emit();return false}
      if(!sent.response.ok||!sent.result.ok)throw new Error(sent.result.error||'Sync push failed');
      serverVersion=Number(sent.result.version||serverVersion);lastSyncAt=Date.now();
      writeQueue([]);queued=false;lastError=null;emit();return true;
    }catch(e){lastError=e?.message||'Sync push failed';if(!readQueue().length)enqueue();else markQueued();return false}
    finally{syncing=false;emit()}
  }
  window.EderStonePOSSync=Object.freeze({pull,push,status:()=>({online:navigator.onLine,synced:serverVersion>0,syncing,queued,queueSize:readQueue().length,lastSyncAt,lastError,serverVersion}),clearQueue:()=>{writeQueue([]);queued=false;emit()}});
  window.addEventListener('offline',()=>{markQueued();});
  window.addEventListener('online',()=>{pull().then(()=>push())});
  window.addEventListener('load',()=>{emit();pull()});
  window.addEventListener('ederstone:state-change',e=>{if(e.detail?.key!==KEY||e.detail?.source==='storage'||suppressPush)return;clearTimeout(window.__ederstoneSyncTimer);window.__ederstoneSyncTimer=setTimeout(push,900)});
})();
