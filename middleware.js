import crypto from 'node:crypto';
import { next } from '@vercel/functions';

export const config={runtime:'nodejs'};

const SECRET=process.env.PORTFOLIO_AUTH_SECRET;
const COOKIE='__Host-ederstone_session';

function allowed(path){
  return path==='/auth.html'||path==='/owner.html'||path.startsWith('/api/')||path.startsWith('/assets/')||
    path==='/auth.css'||path==='/auth.js'||path==='/manifest.json'||path==='/service-worker.js'||path==='/favicon.ico'||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|mp4|woff2?)$/i.test(path);
}

function valid(token){
  if(!SECRET||!token)return false;
  const parts=token.split('.');
  if(parts.length!==2)return false;
  try{
    const exp=Number(Buffer.from(parts[0],'base64url').toString());
    if(!exp||exp<Date.now())return false;
    const expected=crypto.createHmac('sha256',SECRET).update(String(exp)).digest('base64url');
    if(expected.length!==parts[1].length)return false;
    return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(parts[1]));
  }catch(e){return false}
}

export default function middleware(request){
  const url=new URL(request.url);
  const path=url.pathname;
  if(allowed(path))return next();
  const cookie=request.headers.get('cookie')||'';
  const token=cookie.match(/(?:^|;\s*)__Host-ederstone_session=([^;]+)/)?.[1];
  if(valid(token))return next();
  const nextPath=encodeURIComponent(path+(url.search||''));
  return Response.redirect(new URL('/auth.html?next='+nextPath,request.url),302);
}