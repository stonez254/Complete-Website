document.addEventListener('DOMContentLoaded',()=>{const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();const links=[['index.html','Home'],['about.html','About'],['projects.html','Projects'],['code.html','Code Lab'],['services.html','Services'],['break.html','Creative'],['contact.html','Contact']];const header=document.querySelector('.site-header');if(header){const nav=links.map(([href,label])=>{const current=page===href?' aria-current="page"':'';const cls=label==='Code Lab'?' class="ui-code"':'';return `<a href="${href}"${cls}${current}>${label}</a>`}).join('');header.outerHTML=`<div class="global-pane"><a class="global-brand" href="index.html" aria-label="Ederstone home"><span class="ui-logo-mark">ES</span><span class="ui-brand-word">EDERSTONE</span></a><nav class="global-nav" aria-label="Primary navigation">${nav}</nav><div class="ui-status"><span class="ui-status-dot"></span>ONLINE</div><div class="ui-info"><div class="ui-clock"><strong id="ui-time">--:--:--</strong><small id="ui-date">Loading date</small></div><div class="ui-weather"><strong><span class="ui-weather-icon" id="ui-weather-icon">◌</span><span id="ui-weather-temp">--°C</span></strong><small id="ui-weather-text">Loading weather</small></div></div><button class="ui-theme" id="ui-theme" type="button" aria-label="Toggle light and dark theme" title="Toggle theme">☾</button></div>`}const root=document.documentElement;const saved=localStorage.getItem('ederstone-theme');if(saved==='light')root.classList.add('ui-light');const theme=document.getElementById('ui-theme');if(theme){theme.textContent=root.classList.contains('ui-light')?'☀':'☾';theme.addEventListener('click',()=>{const light=root.classList.toggle('ui-light');localStorage.setItem('ederstone-theme',light?'light':'dark');theme.textContent=light?'☀':'☾'})}const timeEl=document.getElementById('ui-time'),dateEl=document.getElementById('ui-date');const updateClock=()=>{const now=new Date();const time=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);const date=new Intl.DateTimeFormat(undefined,{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(now);if(timeEl){timeEl.textContent=time;timeEl.style.visibility='visible'}if(dateEl){dateEl.textContent=date;dateEl.style.visibility='visible'}};updateClock();setInterval(updateClock,1000);const weatherText={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorm',96:'Storm + hail',99:'Storm + hail'};const weatherIcon=code=>code===0?'☀':([1,2].includes(code)?'⛅':([3,45,48].includes(code)?'☁':([51,53,55,61,63,65,80,81,82].includes(code)?'🌧':'⛈')));const showWeather=(data,city='Local')=>{const temp=document.getElementById('ui-weather-temp'),text=document.getElementById('ui-weather-text'),icon=document.getElementById('ui-weather-icon');if(temp)temp.textContent=`${Math.round(data.temperature)}°C`;if(text)text.textContent=`${weatherText[data.weathercode]||'Current conditions'} · ${city}`;if(icon)icon.textContent=weatherIcon(data.weathercode)};const loadWeather=async(lat=-1.286389,lon=36.817223,city='Nairobi')=>{try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);if(!r.ok)throw new Error('Weather request failed');const j=await r.json();if(j.current)showWeather({temperature:j.current.temperature_2m,weathercode:j.current.weather_code},city)}catch(e){const t=document.getElementById('ui-weather-text');if(t)t.textContent='Weather unavailable'}};if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>loadWeather(p.coords.latitude,p.coords.longitude,'Your location'),()=>loadWeather(),{timeout:3500,maximumAge:1800000})}else loadWeather();const hero=document.querySelector('.hero-copy');if(hero&&page==='index.html'){const intro=document.createElement('div');intro.className='typing-intro';intro.innerHTML='<span id="typing-text"></span><span class="cursor"></span>';hero.prepend(intro);const target=document.getElementById('typing-text');const messages=['Welcome to Ederstone.','Mathematics × Code × Creation.','Ideas become reality here.'];let m=0,i=0,deleting=false;const type=()=>{if(!target)return;const word=messages[m];target.textContent=deleting?word.slice(0,i-1):word.slice(0,i+1);i+=deleting?-1:1;let delay=deleting?45:75;if(!deleting&&i===word.length){delay=1400;deleting=true}else if(deleting&&i===0){deleting=false;m=(m+1)%messages.length;delay=400}setTimeout(type,delay)};setTimeout(type,350)}});

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
