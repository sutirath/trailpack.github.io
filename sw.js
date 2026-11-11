const CACHE='trailpack-v9';
const CORE=['./','./index.html','./manifest.webmanifest','./lucide.min.js','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
const FONT_CSS=[
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap'
];
const isFont=h=>/fonts\.(googleapis|gstatic)\.com$/.test(h);

// Best effort: cache Google Fonts CSS + font files at install, so fonts work offline from the first visit.
async function precacheFonts(c){
  await Promise.all(FONT_CSS.map(async url=>{
    try{
      const res=await fetch(url,{mode:'cors'});
      if(!res.ok) return;
      await c.put(url,res.clone());
      const css=await res.text();
      const files=[...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m=>m[1]);
      await Promise.all(files.map(f=>fetch(f,{mode:'cors'}).then(r=>r.ok&&c.put(f,r)).catch(()=>{})));
    }catch(e){}
  }));
}

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(async c=>{
    await c.addAll(CORE);
    await precacheFonts(c);
  }).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

// Network with timeout: weak signal on the trail shouldn't leave the app hanging.
function netTimeout(p,ms){
  return new Promise((resolve,reject)=>{
    const t=setTimeout(()=>reject(new Error('timeout')),ms);
    p.then(r=>{clearTimeout(t);resolve(r)},err=>{clearTimeout(t);reject(err)});
  });
}

self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);

  if(r.mode==='navigate'){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      const update=fetch(r).then(res=>{if(res&&res.ok)c.put('./index.html',res.clone());return res});
      try{ return await netTimeout(update,3000); }
      catch(err){
        const hit=await c.match('./index.html')||await c.match('./');
        if(hit){ e.waitUntil(update.catch(()=>{})); return hit; }
        return update;
      }
    })());
    return;
  }

  if(u.origin===location.origin||isFont(u.hostname)){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      const hit=await c.match(r,{ignoreSearch:u.origin===location.origin});
      const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res});
      if(hit){ e.waitUntil(net.catch(()=>{})); return hit; }
      try{ return await net; }
      catch(err){ return new Response('',{status:504,statusText:'Offline'}); }
    })());
  }
});
