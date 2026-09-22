(() => {
  'use strict';
  let user = null;
  let booted = false;
  const publicPaths = new Set(['/auth','/auth.html','/access-loader','/access-loader.html','/session-expired','/session-expired.html','/']);
  const cacheKey='ederstone-auth-user-v1';
  const sessionExpiry=()=>Number(sessionStorage.getItem('ederstone-session-expires')||0);
  const cachedUser=()=>{try{const value=JSON.parse(sessionStorage.getItem(cacheKey)||'null');return value?.id&&value?.role?value:null;}catch(_){return null;}};
  function applyUser(value,offline=false){
    user=Object.freeze({...value,offline:!!offline});
    window.EderStoneAuth=Object.freeze({authenticated:true,user,offline:!!offline});
    if(user.role)sessionStorage.setItem('ederstone-role',user.role);
    document.documentElement.dataset.ederstoneRole=user.role||'';
    document.documentElement.dataset.ederstoneAuth=offline?'offline':'online';
    window.dispatchEvent(new CustomEvent('ederstone:auth-ready',{detail:{user,offline:!!offline}}));
    window.EderStonePOSPermissions?.refresh?.();
    booted=true;
    return user;
  }

  async function bootstrap(force=false){
    if(booted && !force) return user;
    try{
      const response=await fetch('/api/auth',{credentials:'include',cache:'no-store'});
      const data=await response.json().catch(()=>({}));
      if(!response.ok || !data.authenticated || !data.user?.active){
        if(!publicPaths.has(location.pathname)){
          const next=location.pathname+location.search;
          location.replace('/auth?next='+encodeURIComponent(next.startsWith('/')&&!next.startsWith('//')?next:'/'));
        }
        return null;
      }
      sessionStorage.setItem(cacheKey,JSON.stringify(data.user));
      return applyUser(data.user,false);
    }catch(_){
      const cached=cachedUser();
      const exp=sessionExpiry();
      if(cached && exp && Date.now()<exp){
        return applyUser(cached,true);
      }
      if(!publicPaths.has(location.pathname)) location.replace('/auth?next='+encodeURIComponent(location.pathname));
      return null;
    }
  }

  window.EderStoneAuthSession=Object.freeze({bootstrap,user:()=>user,refresh:()=>bootstrap(true)});
  window.addEventListener('online',()=>{bootstrap(true);});
  if(!publicPaths.has(location.pathname)) {
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
    else bootstrap();
  }
})();