import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.env.QA_STATIC_ROOT||'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((request,response)=>{
  try{
    const url=new URL(request.url,'http://127.0.0.1');
    let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep)&&file!==root){response.writeHead(403).end();return;}
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file)){response.writeHead(404).end('Not found');return;}
    response.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).on('error',()=>response.destroy()).pipe(response);
  }catch{response.writeHead(400).end('Bad request');}
});
server.listen({host:'127.0.0.1',port:Number(process.env.QA_PORT||4322),backlog:1024},()=>console.log('QA preview http://127.0.0.1:'+server.address().port));
