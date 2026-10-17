// Demo app for the CI/CD for Testers course: a small copy of Restful-Booker (github.com/mwinteringham/restful-booker) + login page. No dependencies.
const http=require('http'),crypto=require('crypto');
let db=[],counter=0,logins={};
function seed(){db=[];counter=0;[["Sally","Brown",111,true,"2013-02-23","2014-10-23","Breakfast"],["Jim","Brown",222,false,"2018-01-01","2019-01-01","Lunch"],["Mary","Jones",333,true,"2020-05-01","2020-05-07","Dinner"]].forEach(r=>{counter++;db.push({bookingid:counter,firstname:r[0],lastname:r[1],totalprice:r[2],depositpaid:r[3],bookingdates:{checkin:r[4],checkout:r[5]},additionalneeds:r[6]})})}
seed();
const strip=b=>{const {bookingid,...x}=b;return x};
const valid=p=>p&&p.firstname&&p.lastname&&p.totalprice!==undefined&&p.depositpaid!==undefined&&p.bookingdates&&p.bookingdates.checkin&&p.bookingdates.checkout;
const users=Array.from({length:12},(_,i)=>({id:i+1,name:'User '+(i+1)}));
const orders={1:{id:1,owner:'userA',item:'Laptop'},2:{id:2,owner:'userB',item:'Phone'}};
http.createServer((req,res)=>{let body='';req.on('data',c=>body+=c);req.on('end',()=>{
 const u=new URL(req.url,'http://x'),p=u.pathname,m=req.method;
 let json={};try{json=body?JSON.parse(body):{}}catch(e){json=null}
 const cookies=Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(c=>c.trim().split('=')));
 const authed=logins[cookies.token]||req.headers.authorization==='Basic YWRtaW46cGFzc3dvcmQxMjM=';
 const send=(s,o)=>{if(o===undefined){res.writeHead(s,{'Content-Type':'text/plain'});res.end(http.STATUS_CODES[s]);}else{res.writeHead(s,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(o));}};
 const mm=p.match(/^\/booking\/(\d+)$/),b=mm&&db.find(x=>x.bookingid==mm[1]);
 if(p==='/ping'&&m==='GET')return send(201);
 if(p==='/auth'&&m==='POST')return (json&&json.username==='admin'&&json.password==='password123')?(()=>{const t=crypto.randomBytes(8).toString('hex').slice(0,15);logins[t]=1;send(200,{token:t})})():send(200,{reason:'Bad credentials'});
 if(p==='/booking'&&m==='GET'){let r=db;for(const k of ['firstname','lastname'])if(u.searchParams.has(k))r=r.filter(x=>x[k]===u.searchParams.get(k));return send(200,r.map(x=>({bookingid:x.bookingid})))}
 if(p==='/booking'&&m==='POST'){if(!valid(json))return send(500);counter++;const n={bookingid:counter,...json};db.push(n);return send(200,{bookingid:counter,booking:strip(n)})}
 if(mm&&m==='GET')return b?send(200,strip(b)):send(404);
 if(mm&&(m==='PUT'||m==='PATCH')){if(!authed)return send(403);if(m==='PUT'&&!valid(json))return send(400);if(!b)return send(405);Object.assign(b,json);return send(200,strip(b))}
 if(mm&&m==='DELETE'){if(!authed)return send(403);if(!b)return send(405);db=db.filter(x=>x!==b);return send(201)}
 // demo endpoints (not part of restful-booker)
 if(p==='/api/users'&&m==='GET'){const page=+(u.searchParams.get('page')||1),per=+(u.searchParams.get('per_page')||5);return send(200,{page,per_page:per,total:users.length,total_pages:Math.ceil(users.length/per),data:users.slice((page-1)*per,page*per)})}
 const om=p.match(/^\/api\/orders\/(\d+)$/);
 if(om&&m==='GET'){const who=(req.headers.authorization||'').replace('Bearer ','');if(!who)return send(401,{error:'Missing token'});const o=orders[om[1]];if(!o)return send(404,{error:'Not found'});if(o.owner!==who)return send(403,{error:'Forbidden'});return send(200,o)}
 if(p==='/app.html'||p==='/app'){res.writeHead(200,{'Content-Type':'text/html'});return res.end('<ul id=l></ul><script>fetch("/api/bookings").then(r=>r.json()).then(d=>{l.innerHTML=d.map(b=>"<li>"+b.firstname+"</li>").join("")})</script>')}
 if(p==='/bookings'||p==='/bookings.html'){res.writeHead(200,{'Content-Type':'text/html'});return res.end('<h1>Bookings</h1><ul>'+db.map(x=>`<li>${x.firstname} ${x.lastname}</li>`).join('')+'</ul>')}
 if(p==='/login'){res.writeHead(200,{'Content-Type':'text/html'});return res.end(`<h1>Login</h1><form id=f><label>Email <input name=email type=email></label><label>Password <input name=password type=password></label><button type=submit>Sign in</button></form><p id=msg role=alert></p><script>f.onsubmit=e=>{e.preventDefault();const ok=f.email.value.toLowerCase()==="asha@test.com"&&f.password.value==="Secret123";setTimeout(()=>{if(ok){document.body.innerHTML="<h1>Welcome, Asha</h1>"}else{msg.textContent="Invalid email or password"}},300)}</script>`)}
 if(p==='/__reset'){seed();logins={};return send(200,{ok:1})}
 send(404);
})}).listen(process.env.PORT||3001,()=>console.log('lab api on 3001'));
