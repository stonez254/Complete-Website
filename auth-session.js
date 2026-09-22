(() => {
  'use strict';
  let user = null;
  let booted = false;
  const publicPaths = new Set(['/auth','/auth.html','/access-loader','/access-loader.html','/session-expired','/session-expired.html','/']);

  async function bootstrap(){
    if(booted) return user;
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
      user=Object.freeze(data.user);
      window.EderStoneAuth=Object.freeze({authenticated:true,user});
      sessionStorage.setItem('ederstone-role',user.role);
      document.documentElement.dataset.ederstoneRole=user.role;
      window.dispatchEvent(new CustomEvent('ederstone:auth-ready',{detail:{user}}));
      window.EderStonePOSPermissions?.refresh?.();
      booted=true;
      return user;
    }catch(_){
      if(!publicPaths.has(location.pathname)) location.replace('/auth?next='+encodeURIComponent(location.pathname));
      return null;
    }
  }

  window.EderStoneAuthSession=Object.freeze({bootstrap,user:()=>user});
  if(!publicPaths.has(location.pathname)) {
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
    else bootstrap();
  }
})();