import { staffApi } from './auth.js';
export default async function handler(req,res){
  const request=new Request('http://localhost/api/staff',{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:JSON.stringify(req.body||{})});
  const response=await staffApi(request);
  const body=await response.text();
  res.status(response.status).setHeader('Content-Type','application/json');
  return res.send(body);
}
