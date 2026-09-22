(() => {
  'use strict';
  const KEY='ederstone-session-expires';
  const expiredKey='ederstone-session-expired';
  let timer=null;

  const expiry=()=>Number(sessionStorage.getItem(KEY)||0);
  const clear=()=>{sessionStorage.removeItem(KEY);sessionStorage.removeItem('ederstone-session-start');};

  async function logout(reason='manual'){
    clear();
    sessionStorage.setItem(expiredKey,reason);
    try{await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({action:'logout'})});}catch(_){}
    const next=location.pathname+location.search;
    location.href='/auth?next='+encodeURIComponent(next.startsWith('/')&&!next.startsWith('//')?next:'/');
  }

  function check(){
    const exp=expiry();
    if(exp && Date.now()>=exp){clearTimeout(timer);logout('expired');return false;}
    if(exp){
      const remaining=exp-Date.now();
      window.dispatchEvent(new CustomEvent('ederstone:session-tick',{detail:{expiresAt:exp,remainingMs:remaining}}));
      clearTimeout(timer);timer=setTimeout(check,Math.min(Math.max(remaining,1000),30000));
    }
    return true;
  }

  window.EderStoneSession=Object.freeze({
    expiresAt:expiry,
    remaining:()=>Math.max(0,expiry()-Date.now()),
    check,
    logout
  });

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
  window.addEventListener('pageshow',check);
  check();
})();