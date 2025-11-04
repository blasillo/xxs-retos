const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const LEVELS = {
  'a7f3k9': { level: 1, flag: 'FLAG{n1v3l_1_c0mpl3t4d0_s1n_f1ltr0s}' },
  'x9m2q5': { level: 2, flag: 'FLAG{n1v3l_2_3sc4p4nd0_4ttr1but0s}' },
  'b5n8w3': { level: 3, flag: 'FLAG{n1v3l_3_t3xt4r34_3sc4p3}' }
};

app.get('/', (req, res) => {
    res.redirect('/nivel1');
  });


app.get('/nivel1', (req, res) => {
  const payload = req.query.payload || '';
  res.send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Nivel 1</title>
<style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:16px}input[type=text]{width:100%;padding:8px;margin:8px 0}button{padding:8px 12px}.success{background:#d4edda;color:#155724;border:1px solid #c3e6cb;padding:10px;margin-top:20px;border-radius:4px}</style>
</head>
<body>
<h1>Nivel 1</h1>
<form action="/nivel1" method="get">
<input name="payload" type="text" placeholder="Introduce tu nombre">
<button>Enviar</button>
<button type="button" onclick="verificar()">Verificar XSS</button>
</form>
<div>${payload ? '<h3>Hola ' + payload + '</h3>' : ''}</div>
<div id="confirmxss"></div>
<script>
function verificar(){
var p=new URLSearchParams(location.search).get('payload');
if(!p)return alert('No hay payload');
document.getElementById('confirmxss').innerHTML='Verificando...';
fetch('/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:p,code:'a7f3k9'})})
.then(r=>r.json())
.then(d=>{
document.getElementById('confirmxss').innerHTML=d.success?'<div class="success">✅ XSS Exitoso!<br>FLAG: <code>'+d.flag+'</code></div>':'❌ No se detectó XSS';
});
}
</script>
</body>
</html>`);
});

app.get('/nivel2', (req, res) => {
  const payload = req.query.payload || '';
  res.send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Nivel 2</title>
<style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:16px}input[type=text]{width:100%;padding:8px;margin:8px 0}button{padding:8px 12px}.success{background:#d4edda;color:#155724;border:1px solid #c3e6cb;padding:10px;margin-top:20px;border-radius:4px}</style>
</head>
<body>
<h1>Nivel 2</h1>
<form action="/nivel2" method="get">
<input name="payload" type="text" placeholder="Introduce tu nombre">
<button>Enviar</button>
<button type="button" onclick="verificar()">Verificar XSS</button>
</form>
<div>
<h3>Hola </h3><input type="text" value="${payload}" readonly style="width:100%;padding:8px">
</div>
<div id="confirmxss"></div>
<script>
function verificar(){
var p=new URLSearchParams(location.search).get('payload');
if(!p)return alert('No hay payload');
document.getElementById('confirmxss').innerHTML='Verificando...';
fetch('/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:p,code:'x9m2q5'})})
.then(r=>r.json())
.then(d=>{
document.getElementById('confirmxss').innerHTML=d.success?'<div class="success">✅ XSS Exitoso!<br>FLAG: <code>'+d.flag+'</code></div>':'❌ No se detectó XSS';
});
}
</script>
</body>
</html>`);
});

app.get('/nivel3', (req, res) => {
  const payload = req.query.payload || '';
  res.send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Nivel 3</title>
<style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:16px}input[type=text],textarea{width:100%;padding:8px;margin:8px 0}button{padding:8px 12px}.success{background:#d4edda;color:#155724;border:1px solid #c3e6cb;padding:10px;margin-top:20px;border-radius:4px}</style>
</head>
<body>
<h1>Nivel 3</h1>
<form action="/nivel3" method="get">
<input name="payload" type="text" placeholder="Introduce tu comentario">
<button>Enviar</button>
<button type="button" onclick="verificar()">Verificar XSS</button>
</form>
<div>
<h3>Hola </h3><textarea readonly style="width:50%;height:100px;padding:8px">${payload}</textarea>
</div>
<div id="confirmxss"></div>
<script>
function verificar(){
var p=new URLSearchParams(location.search).get('payload');
if(!p)return alert('No hay payload');
document.getElementById('confirmxss').innerHTML='Verificando...';
fetch('/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:p,code:'b5n8w3'})})
.then(r=>r.json())
.then(d=>{
document.getElementById('confirmxss').innerHTML=d.success?'<div class="success">✅ XSS Exitoso!<br>FLAG: <code>'+d.flag+'</code></div>':'❌ No se detectó XSS';
});
}
</script>
</body>
</html>`);
});

app.post('/check', async (req, res) => {
  const {payload,code} = req.body;
  if(!LEVELS[code]) return res.json({success:false});
  const {level,flag} = LEVELS[code];
  let b,d=false;
  try{
    b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-setuid-sandbox']});
    const p=await b.newPage();
    p.on('dialog',async x=>{d=true;await x.accept();});
    await p.goto(`http://localhost:3000/nivel${level}?payload=${encodeURIComponent(payload)}`,{waitUntil:'networkidle0',timeout:10000});
    await p.waitForTimeout(1000);
    await b.close();
    res.json({success:d,flag:d?flag:null});
  }catch(e){
    if(b)await b.close();
    res.json({success:false});
  }
});

app.listen(3000,()=>console.log('http://localhost:3000/nivel1\nhttp://localhost:3000/nivel2\nhttp://localhost:3000/nivel3'));