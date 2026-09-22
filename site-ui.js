document.addEventListener('DOMContentLoaded',()=>{const page=location.pathname.replace(/\/$/,'')||'/';const header=document.querySelector('.site-header');if(header){const links=[['/','Home'],['/about','About'],['/projects','Projects'],['/code','Code Lab'],['/services','Services'],['/creative','Creative'],['/contact','Contact']];const nav=links.map(([href,label])=>{const current=page===href?' aria-current="page"':'';const cls=label==='Code Lab'?' class="ui-code"':'';return `<a href="${href}"${cls}${current}>${label}</a>`}).join('');header.outerHTML=`<div class="global-pane"><a class="global-brand" href="index.html" aria-label="Ederstone home"><span class="ui-logo-mark">ES</span><span class="ui-brand-word">EDERSTONE</span></a><nav class="global-nav" aria-label="Primary navigation">${nav}</nav><div class="ui-status"><span class="ui-status-dot"></span>ONLINE</div><div class="ui-info"><div class="ui-clock"><strong id="ui-time">--:--:--</strong><small id="ui-date">Loading date</small></div><div class="ui-weather"><strong><span class="ui-weather-icon" id="ui-weather-icon">◌</span><span id="ui-weather-temp">--°C</span></strong><small id="ui-weather-text">Loading weather</small></div></div><button class="ui-logout" id="ui-logout" type="button" aria-label="Log out of portfolio" title="Log out">⏻</button><button class="ui-theme" id="ui-theme" type="button" aria-label="Toggle light and dark theme" title="Toggle theme">☾</button></div>`}const root=document.documentElement;const saved=localStorage.getItem('ederstone-theme');if(saved==='light')root.classList.add('ui-light');const theme=document.getElementById('ui-theme');if(theme){theme.textContent=root.classList.contains('ui-light')?'☀':'☾';theme.addEventListener('click',()=>{const light=root.classList.toggle('ui-light');localStorage.setItem('ederstone-theme',light?'light':'dark');theme.textContent=light?'☀':'☾'})}const timeEl=document.getElementById('ui-time'),dateEl=document.getElementById('ui-date');const updateClock=()=>{const now=new Date();const time=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);const date=new Intl.DateTimeFormat(undefined,{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(now);if(timeEl){timeEl.textContent=time;timeEl.style.visibility='visible'}if(dateEl){dateEl.textContent=date;dateEl.style.visibility='visible'}};updateClock();setInterval(updateClock,1000);const weatherText={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorm',96:'Storm + hail',99:'Storm + hail'};const weatherIcon=code=>code===0?'☀':([1,2].includes(code)?'⛅':([3,45,48].includes(code)?'☁':([51,53,55,61,63,65,80,81,82].includes(code)?'🌧':'⛈')));const showWeather=(data,city='Local')=>{const temp=document.getElementById('ui-weather-temp'),text=document.getElementById('ui-weather-text'),icon=document.getElementById('ui-weather-icon');if(temp)temp.textContent=`${Math.round(data.temperature)}°C`;if(text)text.textContent=`${weatherText[data.weathercode]||'Current conditions'} · ${city}`;if(icon)icon.textContent=weatherIcon(data.weathercode)};const loadWeather=async(lat=-1.286389,lon=36.817223,city='Nairobi')=>{try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);if(!r.ok)throw new Error('Weather request failed');const j=await r.json();if(j.current)showWeather({temperature:j.current.temperature_2m,weathercode:j.current.weather_code},city)}catch(e){const t=document.getElementById('ui-weather-text');if(t)t.textContent='Weather unavailable'}};if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>loadWeather(p.coords.latitude,p.coords.longitude,'Your location'),()=>loadWeather(),{timeout:3500,maximumAge:1800000})}else loadWeather();const hero=document.querySelector('.hero-copy');if(hero&&page==='index.html'){const intro=document.createElement('div');intro.className='typing-intro';intro.innerHTML='<span id="typing-text"></span><span class="cursor"></span>';hero.prepend(intro);const target=document.getElementById('typing-text');const messages=['Welcome to Ederstone.','Mathematics × Code × Creation.','Ideas become reality here.'];let m=0,i=0,deleting=false;const type=()=>{if(!target)return;const word=messages[m];target.textContent=deleting?word.slice(0,i-1):word.slice(0,i+1);i+=deleting?-1:1;let delay=deleting?45:75;if(!deleting&&i===word.length){delay=1400;deleting=true}else if(deleting&&i===0){deleting=false;m=(m+1)%messages.length;delay=400}setTimeout(type,delay)};setTimeout(type,350)}});

function initCookieConsent(){
  const key='ederstone-cookie-consent';
  const existing=localStorage.getItem(key);
  const banner=document.createElement('aside');
  banner.className='cookie-push';
  banner.setAttribute('aria-label','Cookie preferences');
  banner.innerHTML='<div class="cookie-push-copy"><span class="cookie-push-badge">PRIVACY</span><strong>Cookies & local storage</strong><p>This site uses essential browser storage for preferences such as theme and cookie consent. Optional analytics or advertising cookies are not enabled by this portfolio.</p></div><div class="cookie-push-actions"><button class="cookie-btn cookie-btn-necessary" type="button" data-cookie="necessary">Necessary only</button><button class="cookie-btn cookie-btn-accept" type="button" data-cookie="accept">Accept</button></div>';
  const close=(value)=>{localStorage.setItem(key,value);banner.classList.add('is-closing');setTimeout(()=>banner.remove(),220)};
  banner.querySelector('[data-cookie="necessary"]').addEventListener('click',()=>close('necessary'));
  banner.querySelector('[data-cookie="accept"]').addEventListener('click',()=>close('accepted'));
  if(!existing) document.body.appendChild(banner);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initCookieConsent); else initCookieConsent();

function initAIGuide(){
  if(document.getElementById('ai-guide-button')) return;
  const button=document.createElement('button');
  button.id='ai-guide-button';
  button.className='ai-guide-button';
  button.type='button';
  button.setAttribute('aria-label','Ask AI to guide and summarise this page');
  button.title='AI Guide';
  button.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="8"></circle><path d="M10 39c1.8-8 6.4-12 14-12s12.2 4 14 12"></path><path d="M6 24h4M38 24h4M24 5V1"></path></svg><span>AI GUIDE</span>';
  document.body.appendChild(button);

  const modal=document.createElement('div');
  modal.className='ai-guide-modal';
  modal.hidden=true;
  modal.innerHTML='<div class="ai-guide-backdrop" data-ai-close></div><section class="ai-guide-panel" role="dialog" aria-modal="true" aria-labelledby="ai-guide-title"><button class="ai-guide-close" type="button" data-ai-close aria-label="Close AI Guide">×</button><div class="ai-guide-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="8"></circle><path d="M10 39c1.8-8 6.4-12 14-12s12.2 4 14 12"></path></svg></div><p class="ai-guide-kicker">EDERSTONE / AI GUIDE</p><h2 id="ai-guide-title">Need a quick guide?</h2><p class="ai-guide-copy">Ask AI to summarise this page, explain the sections or help you understand what is here.</p><div class="ai-guide-actions"><button class="ai-guide-copy-btn" type="button" id="ai-guide-copy">Copy AI prompt</button><button class="ai-guide-open-btn" type="button" id="ai-guide-open">Open ChatGPT ↗</button></div><p class="ai-guide-note" id="ai-guide-note">The prompt includes the current page content. No API key is stored on this website.</p></section></div>';
  document.body.appendChild(modal);

  const getPrompt=()=>{
    const clone=document.body.cloneNode(true);
    clone.querySelectorAll('#ai-guide-button,.ai-guide-modal,.global-pane,.cookie-push,script,style,noscript').forEach(el=>el.remove());
    const title=document.title.replace(/\s*\|\s*Ederstone.*$/i,'');
    const text=(clone.innerText||'').replace(/\n{3,}/g,'\n\n').trim().slice(0,14000);
    return 'You are the AI guide for the Ederstone portfolio. Summarise the page below in clear, concise sections. Explain what the page contains, the key points a visitor should know, and any important calls to action. Do not invent information. If something is a concept or ongoing work, preserve that wording.\n\nPAGE: '+title+'\n\nCONTENT:\n'+text;
  };
  const close=()=>{modal.hidden=true;document.body.classList.remove('ai-guide-open')};
  let dragging=false,startX=0,startY=0,startLeft=0,startTop=0,moved=false;
  const saved=localStorage.getItem('ederstone-ai-guide-position');
  if(saved){try{const p=JSON.parse(saved);button.style.left=p.left+'px';button.style.top=p.top+'px';button.style.right='auto';button.style.bottom='auto'}catch(e){}}
  const move=(x,y)=>{
    const maxX=window.innerWidth-button.offsetWidth,maxY=window.innerHeight-button.offsetHeight;
    const left=Math.max(0,Math.min(maxX,startLeft+x-startX)),top=Math.max(0,Math.min(maxY,startTop+y-startY));
    button.style.left=left+'px';button.style.top=top+'px';button.style.right='auto';button.style.bottom='auto';
  };
  button.addEventListener('pointerdown',e=>{
    dragging=true;moved=false;startX=e.clientX;startY=e.clientY;
    const r=button.getBoundingClientRect();startLeft=r.left;startTop=r.top;
    button.setPointerCapture?.(e.pointerId);button.classList.add('is-dragging');e.preventDefault();
  });
  button.addEventListener('pointermove',e=>{if(!dragging)return;if(Math.abs(e.clientX-startX)>4||Math.abs(e.clientY-startY)>4)moved=true;move(e.clientX,e.clientY)});
  button.addEventListener('pointerup',e=>{
    if(!dragging)return;dragging=false;button.classList.remove('is-dragging');
    const r=button.getBoundingClientRect();
    localStorage.setItem('ederstone-ai-guide-position',JSON.stringify({left:r.left,top:r.top}));
    if(moved)e.preventDefault();
  });
  button.addEventListener('click',e=>{
    if(moved){e.preventDefault();moved=false;return}
    modal.hidden=false;document.body.classList.add('ai-guide-open');setTimeout(()=>modal.querySelector('.ai-guide-close').focus(),0)
  });
  modal.querySelectorAll('[data-ai-close]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
  modal.querySelector('#ai-guide-copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(getPrompt());modal.querySelector('#ai-guide-note').textContent='AI prompt copied. Paste it into any AI assistant to get a page summary.'}
    catch(e){modal.querySelector('#ai-guide-note').textContent='Copy was blocked by the browser. Use Open ChatGPT and copy the prompt manually if needed.'}
  });
  modal.querySelector('#ai-guide-open').addEventListener('click',async()=>{
    const prompt=getPrompt();
    try{await navigator.clipboard.writeText(prompt);modal.querySelector('#ai-guide-note').textContent='Prompt copied. ChatGPT is opening now. Paste the prompt into the chat.'}catch(e){}
    window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAIGuide); else initAIGuide();


// CV reveal: keep the detailed CV hidden until the visitor explicitly selects See CV.
document.addEventListener('DOMContentLoaded',()=>{
  const cv=document.getElementById('cv');
  const trigger=document.querySelector('.cv-see-button');
  if(!cv||!trigger)return;
  cv.hidden=true;
  trigger.addEventListener('click',event=>{
    event.preventDefault();
    cv.hidden=false;
    cv.removeAttribute('hidden');
    cv.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null,'','#cv');
  });
});


function initPortfolioLock(){const lock=document.getElementById('ui-logout');if(!lock)return;lock.addEventListener('click',async()=>{sessionStorage.removeItem('ederstone-session-start');sessionStorage.removeItem('ederstone-session-expired');try{await fetch('/api/logout',{method:'POST',keepalive:true})}catch(e){}location.replace('/auth.html')})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPortfolioLock);else initPortfolioLock();



/* ACCESSIBLE POEM READER · FOUR-VOICE STUDIO */
function initPoemReader(){
 if(location.pathname.endsWith('/index.html')||location.pathname==='/'||location.pathname.endsWith('/'))return;
 const supported='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
 const buttons=[...document.querySelectorAll('[data-speak-target]')];
 if(!buttons.length)return;
 const state={button:null,queue:[],settings:{mode:'single',voiceIndexes:[null,null,null,null],rate:.9,pitch:1}};
 const key='ederstone-reader-settings';
 try{Object.assign(state.settings,JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){}
 const voices=()=>window.speechSynthesis.getVoices();
 const save=()=>localStorage.setItem(key,JSON.stringify(state.settings));
 const ALLOWED_READER_LANGS=['en','zh','sw','fr','de'];
 const isAllowedVoice=v=>{const lang=(v?.lang||'').toLowerCase();return ALLOWED_READER_LANGS.some(x=>lang===x||lang.startsWith(x+'-'));};
 const getVoiceOptions=()=>{
   const vs=voices();
   return vs.map((v,i)=>({v,i,label:(v.name||'Voice')+' · '+v.lang})).filter(x=>isAllowedVoice(x.v));
 };
 const stop=()=>{
   window.speechSynthesis.cancel();state.queue=[];
   if(state.button){state.button.classList.remove('is-speaking');const l=state.button.querySelector('.reader-label');if(l)l.textContent='Read aloud';const s=state.button.parentElement.querySelector('.reader-status');if(s)s.textContent='';}
   state.button=null;
 };
 const ensurePanel=()=>{
   let panel=document.getElementById('voice-settings');
   if(panel)return panel;
   panel=document.createElement('div');panel.id='voice-settings';panel.className='voice-settings';panel.hidden=true;
   panel.innerHTML='<div class="voice-backdrop" data-voice-close></div><section class="voice-panel" role="dialog" aria-modal="true" aria-labelledby="voice-title"><button class="voice-close" data-voice-close aria-label="Close speech settings">×</button><p class="reader-kicker">EDER POETRY / SPEECH STUDIO</p><h2 id="voice-title">Voice settings</h2><p class="voice-note">Choose up to four voices. Four-voice mode rotates them between stanzas so the poem feels performed rather than narrated by one voice.</p><label>Reading mode<select id="voice-mode"><option value="single">Single voice</option><option value="four">Four-voice rotation</option></select></label><div id="voice-slots"></div><div class="voice-controls"><label>Rate<input id="voice-rate" type="range" min=".6" max="1.2" step=".05"></label><label>Pitch<input id="voice-pitch" type="range" min=".7" max="1.3" step=".05"></label></div><button id="voice-save" class="voice-save">Save speech settings</button></section></div>';
   document.body.appendChild(panel);
   const render=()=>{
     const vs=getVoiceOptions(),wrap=panel.querySelector('#voice-slots');wrap.innerHTML='';
     for(let i=0;i<4;i++){const lab=document.createElement('label');lab.className='voice-slot';lab.innerHTML='<span>VOICE '+(i+1)+'</span>';const sel=document.createElement('select');sel.dataset.voiceSlot=i;sel.innerHTML='<option value="">Auto / allowed language</option>'+vs.map(v=>'<option value="'+v.i+'">'+v.label.replace(/"/g,'&quot;')+'</option>').join('');if(state.settings.voiceIndexes[i]!=null)sel.value=state.settings.voiceIndexes[i];lab.appendChild(sel);wrap.appendChild(lab)}
     panel.querySelector('#voice-mode').value=state.settings.mode||'single';panel.querySelector('#voice-rate').value=state.settings.rate||.9;panel.querySelector('#voice-pitch').value=state.settings.pitch||1;
   };
   panel.querySelectorAll('[data-voice-close]').forEach(x=>x.addEventListener('click',()=>panel.hidden=true));
   panel.querySelector('#voice-save').addEventListener('click',()=>{state.settings.mode=panel.querySelector('#voice-mode').value;state.settings.rate=+panel.querySelector('#voice-rate').value;state.settings.pitch=+panel.querySelector('#voice-pitch').value;state.settings.voiceIndexes=[...panel.querySelectorAll('[data-voice-slot]')].map(s=>s.value===''?null:+s.value);save();panel.hidden=true});
   window.speechSynthesis.addEventListener?.('voiceschanged',render);render();return panel;
 };
 const split=(target)=>{
   const nodes=[...target.querySelectorAll('p')].map(x=>x.innerText.trim()).filter(Boolean);
   return nodes.length?nodes:[(target.innerText||target.textContent||'').replace(/\s+/g,' ').trim()];
 };
 const speak=(button,target)=>{
   stop();
   state.button=button;
   button.classList.add('is-speaking');
   const label=button.querySelector('.reader-label');
   if(label)label.textContent='Stop reading';
   const status=button.parentElement.querySelector('.reader-status');
   const parts=split(target);
   const vs=voices();
   let idx=0;
   const next=()=>{
     if(idx>=parts.length){stop();return}
     const text=parts[idx];
     if(!text){idx++;next();return}
     const u=new SpeechSynthesisUtterance(text);
     u.rate=Number(state.settings.rate)||.9;
     u.pitch=Number(state.settings.pitch)||1;
     u.volume=1;
     let vi=state.settings.voiceIndexes?.[state.settings.mode==='four'?idx%4:0];
     if(vi!=null&&vs[vi]&&isAllowedVoice(vs[vi]))u.voice=vs[vi];
     else{const fallback=vs.find(isAllowedVoice);if(fallback)u.voice=fallback;}
     if(status)status.textContent=state.settings.mode==='four'?('Voice '+((idx%4)+1)+' · Starting…'):'Starting…';
     u.onstart=()=>{if(status)status.textContent=state.settings.mode==='four'?('Voice '+((idx%4)+1)+' · Reading…'):'Reading…'};
     u.onend=()=>{idx++;setTimeout(next,30)};
     u.onerror=()=>{if(status)status.textContent='Voice playback stopped';stop()};
     state.queue.push(u);
     try{window.speechSynthesis.resume();window.speechSynthesis.speak(u)}catch(e){if(status)status.textContent='Voice playback is unavailable';stop()}
   };
   if(!parts.length){if(status)status.textContent='No poem text found';stop();return}
   window.speechSynthesis.cancel();
   setTimeout(()=>{window.speechSynthesis.resume();next()},40);
 };
 const globalSettings=[...document.querySelectorAll('[data-open-voice-settings]')];
 globalSettings.forEach(btn=>btn.addEventListener('click',()=>ensurePanel().hidden=false));
 buttons.forEach(button=>{
   if(!supported){button.disabled=true;return}
   button.addEventListener('click',()=>{const target=document.querySelector(button.dataset.speakTarget);if(!target)return;if(state.button===button){stop();return}speak(button,target)});
   const settingsButton=document.createElement('button');settingsButton.type='button';settingsButton.className='poem-action reader-settings-button';settingsButton.innerHTML='<span>⚙</span><span>Speech settings</span>';settingsButton.addEventListener('click',()=>ensurePanel().hidden=false);button.parentElement.appendChild(settingsButton);
 });
 window.addEventListener('pagehide',stop);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPoemReader);else initPoemReader();

/* GLOBAL COPYRIGHT MARQUEE */
function initCopyrightMarquee(){
 document.querySelectorAll('footer').forEach(footer=>{
   footer.querySelectorAll('span').forEach(span=>{
     if(/©?\s*2026\s*Ederstone/i.test(span.textContent||''))span.remove();
   });
   let m=footer.querySelector('.copyright-marquee');
   if(!m){m=document.createElement('div');m.className='copyright-marquee';m.innerHTML='<span>EDERSTONE @2026</span><span>EDERSTONE @2026</span><span>EDERSTONE @2026</span>';footer.prepend(m)}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initCopyrightMarquee);else initCopyrightMarquee();


/* GLOBAL LANGUAGE CONTROL + FIVE-MINUTE PRIVATE SESSION */
function initLanguageControl(){
  if(document.getElementById('ederstone-language-button'))return;
  const wrap=document.createElement('div');
  wrap.className='language-float-wrap';
  wrap.innerHTML='<button id="ederstone-language-button" class="language-float-button" type="button" aria-label="Change portfolio language" title="Language"><span class="language-silhouette" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="15" r="7"></circle><path d="M10 40c2-10 7-15 14-15s12 5 14 15"></path></svg></span><b>LANG</b></button><div class="language-panel" id="ederstone-language-panel" hidden><div class="language-panel-head"><span>EDERSTONE / LANGUAGE</span><button type="button" data-language-close aria-label="Close language selector">×</button></div><p>Translate the entire portfolio.</p><div class="language-options"><button type="button" data-lang="zh-CN">中文</button><button type="button" data-lang="sw">Kiswahili</button><button type="button" data-lang="fr">Français</button><button type="button" data-lang="de">Deutsch</button></div><button class="language-reset" type="button" data-lang-reset>English / Original</button><div id="google_translate_element" aria-hidden="true"></div></div></div>';
  document.body.appendChild(wrap);
  const panel=wrap.querySelector('.language-panel'),button=wrap.querySelector('#ederstone-language-button');
  const setCookie=(value)=>{
    document.cookie='googtrans='+value+';path=/;max-age=31536000;SameSite=Lax';
    document.cookie='googtrans='+value+';path=/;domain='+location.hostname+';max-age=31536000;SameSite=Lax';
  };
  const clearCookie=()=>{document.cookie='googtrans=;path=/;max-age=0';document.cookie='googtrans=;path=/;domain='+location.hostname+';max-age=0'};
  const choose=lang=>{if(lang==='en'){clearCookie()}else{setCookie('/en/'+lang)};localStorage.setItem('ederstone-language',lang);location.reload()};
  button.addEventListener('click',()=>panel.hidden=!panel.hidden);
  panel.querySelector('[data-language-close]').addEventListener('click',()=>panel.hidden=true);
  panel.querySelectorAll('[data-lang]').forEach(x=>x.addEventListener('click',()=>choose(x.dataset.lang)));
  panel.querySelector('[data-lang-reset]').addEventListener('click',()=>choose('en'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.hidden=true});
  /* Suppress third-party translation UI/popups; Ederstone owns the language controls. */
  const blockExternalTranslationPopups=()=>{
    const selectors=['.goog-te-banner-frame','.goog-te-balloon-frame','.goog-te-menu-frame','.goog-tooltip','.goog-te-spinner-pos','.goog-te-gadget','.goog-te-ftab','.goog-te-balloon'];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>el.remove()));
    document.querySelectorAll('iframe').forEach(frame=>{const src=(frame.src||'').toLowerCase();if(src.includes('translate.google.')||src.includes('translate.googleapis.'))frame.remove();});
  };
  blockExternalTranslationPopups();
  new MutationObserver(blockExternalTranslationPopups).observe(document.documentElement,{childList:true,subtree:true});
  const script=document.createElement('script');
  script.src='https://translate.google.com/translate_a/element.js?cb=ederstoneGoogleTranslateInit';
  script.async=true;
  window.ederstoneGoogleTranslateInit=()=>{try{new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false,multilanguagePage:true},'google_translate_element')}catch(e){}};
  document.head.appendChild(script);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initLanguageControl);else initLanguageControl();

function initPrivateSessionGuard(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(path==='auth.html'||path==='owner.html'||path==='access-loader.html'||path==='session-expired.html')return;
  const start=Number(sessionStorage.getItem('ederstone-session-start')||0);
  const serverExpiry=Number(sessionStorage.getItem('ederstone-session-expires')||0);
  if(!start||!serverExpiry){location.replace('/auth.html');return}
  const expire=()=>{if(sessionStorage.getItem('ederstone-session-expired')==='1')return;sessionStorage.setItem('ederstone-session-expired','1');sessionStorage.removeItem('ederstone-session-start');sessionStorage.removeItem('ederstone-session-expires');fetch('/api/logout',{method:'POST',keepalive:true}).catch(()=>{});location.replace('/session-expired.html')};
  fetch('/api/session',{credentials:'same-origin'}).then(r=>{if(!r.ok)expire()}).catch(()=>{});
  const remaining=serverExpiry-Date.now();
  if(remaining<=0){expire();return}
  let timer=document.getElementById('ederstone-access-timer');
  if(!timer){timer=document.createElement('div');timer.id='ederstone-access-timer';timer.className='ederstone-access-timer';timer.setAttribute('role','timer');timer.setAttribute('aria-label','Portfolio access time remaining');document.body.appendChild(timer)}
  let warning=document.getElementById('ederstone-access-warning');
  if(!warning){warning=document.createElement('div');warning.id='ederstone-access-warning';warning.className='ederstone-access-warning';warning.setAttribute('role','alert');warning.hidden=true;warning.innerHTML='<strong>ACCESS TIME RUNNING OUT</strong><span id="ederstone-access-warning-text">You will be logged out soon.</span>';document.body.appendChild(warning)}
  const renderTimer=()=>{
    const left=Math.max(0,serverExpiry-Date.now()),sec=Math.ceil(left/1000),days=Math.floor(sec/86400),hours=Math.floor((sec%86400)/3600),mins=Math.floor((sec%3600)/60),secs=sec%60;
    const display=days?days+'d '+String(hours).padStart(2,'0')+'h':hours?hours+'h '+String(mins).padStart(2,'0')+'m':mins+':'+String(secs).padStart(2,'0');
    timer.textContent='ACCESS · '+display;
    const warningLeft=Math.min(30000,Math.max(0,left));
    timer.classList.toggle('is-warning',warningLeft>0&&left<=30000);
    if(left<=30000&&left>0){warning.hidden=false;const w=warning.querySelector('#ederstone-access-warning-text');if(w)w.textContent='Your portfolio session expires in '+sec+' second'+(sec===1?'':'s')+'.';warning.classList.toggle('is-critical',left<=10000)}else{warning.hidden=true;warning.classList.remove('is-critical')}
    if(left<=0)expire();
  };
  renderTimer();window.setInterval(renderTimer,250);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPrivateSessionGuard);else initPrivateSessionGuard();


/* PWA INSTALL — unified Phase 1 app foundation */
function initEderstoneInstall(){
  if(!document.querySelector('link[rel="manifest"]')){
    const m=document.createElement('link');
    m.rel='manifest';
    m.href='/manifest.webmanifest';
    document.head.appendChild(m);
  }
  if(!document.querySelector('meta[name="mobile-web-app-capable"]')){
    const m=document.createElement('meta');
    m.name='mobile-web-app-capable';
    m.content='yes';
    document.head.appendChild(m);
  }
  if(!document.querySelector('meta[name="apple-mobile-web-app-capable"]')){
    const m=document.createElement('meta');
    m.name='apple-mobile-web-app-capable';
    m.content='yes';
    document.head.appendChild(m);
  }
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{});
    },{once:true});
  }
  let deferred=null;
  const showInstall=()=>{
    if(document.getElementById('ederstone-install-app')||!deferred)return;
    const b=document.createElement('button');
    b.id='ederstone-install-app';
    b.type='button';
    b.className='ederstone-install-app';
    b.innerHTML='<span>↥</span><b>INSTALL APP</b>';
    b.title='Install Ederstone as an app';
    b.setAttribute('aria-label','Install Ederstone as an app');
    b.addEventListener('click',async()=>{
      if(!deferred)return;
      deferred.prompt();
      await deferred.userChoice;
      deferred=null;
      b.remove();
    });
    document.body.appendChild(b);
  };
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferred=e;
    showInstall();
    window.__ederstoneInstallPrompt=e;
    window.dispatchEvent(new CustomEvent('ederstone:install-ready'));
  });
  window.addEventListener('appinstalled',()=>{
    deferred=null;
    document.getElementById('ederstone-install-app')?.remove();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEderstoneInstall);else initEderstoneInstall();
