const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/imagenes', express.static('imagenes'));

const LEVELS = {
    'a7f3k9': { level: 1, flag: 'FLAG{n1v3l_1_c0mpl3t4d0_s1n_f1ltr0s}' },
    'x9m2q5': { level: 2, flag: 'FLAG{n1v3l_2_3sc4p4nd0_4ttr1but0s}' },
    'b5n8w3': { level: 3, flag: 'FLAG{n1v3l_3_t3xt4r34_3sc4p3}' },
    'd4k7p2': { level: 4, flag: 'FLAG{n1v3l_4_byp4ss_f1ltr0_scr1pt}' },
    'm8r5t1': { level: 5, flag: 'FLAG{n1v3l_5_d0m_1nn3rHTML}' },
    'k4wzy7': { level: 6, flag: 'FLAG{n1v3l_6_m4st3r_xss}' },
    'q3v9h7': { level: 7, flag: 'FLAG{n1v3l_7_f1ltr0_r3curs1v0}' },

    //'f5h2m9': { level: 8, flag: 'FLAG{n1v3l_8_csrf_p0st_b4s1c0}' },
  };

  // Estado
//let transfers = [];
//let userEmail = 'usuario@ejemplo.com';


function renderPage(level, content) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>XSS Challenge - Nivel ${level}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #2c3e50; color: white; padding: 20px; }
    header h1 { font-size: 24px; margin-bottom: 10px; }
    nav { background: #34495e; padding: 10px 20px; }
    nav a { color: white; text-decoration: none; margin-right: 15px; padding: 5px 10px; border-radius: 3px; }
    nav a:hover { background: #2c3e50; }
    nav a.active { background: #e74c3c; }
    main { flex: 1; max-width: 720px; margin: 40px auto; padding: 16px; width: 100%; }
    footer { background: #2c3e50; color: white; padding: 20px; text-align: center; }
    input[type=text], textarea { width: 100%; padding: 8px; margin: 8px 0; }
    button { padding: 8px 12px; margin-right: 5px; cursor: pointer; }
    .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 10px; margin-top: 20px; border-radius: 4px; }
  </style>
</head>
<body>
  <header>
    <h1>🎯 Retos XSS </h1>
    <p>Desafío de seguridad web - Cross-Site Scripting</p>
  </header>
   <nav>
    <a href="/nivel1" class="${level === 1 ? 'active' : ''}">Nivel 1</a>
    <a href="/nivel2" class="${level === 2 ? 'active' : ''}">Nivel 2</a>
    <a href="/nivel3" class="${level === 3 ? 'active' : ''}">Nivel 3</a>
    <a href="/nivel4" class="${level === 4 ? 'active' : ''}">Nivel 4</a>
    <a href="/nivel5" class="${level === 5 ? 'active' : ''}">Nivel 5</a>
    <a href="/nivel6" class="${level === 6 ? 'active' : ''}">Nivel 6</a>
    <a href="/nivel7" class="${level === 7 ? 'active' : ''}">Nivel 7</a>
    <!--a href="/csrf1" class="${level === 8 ? 'active' : ''}">CSRF 1</a -->
  </nav>
  <main>
    ${content}
  </main>
  <footer>
    <p>Blasillo XSS Challenge © 2025 - Creado con fines educativos</p>
  </footer>
</body>
</html>`;
}

const nivel1 = require('./levels/nivel1');
const nivel2 = require('./levels/nivel2');
const nivel3 = require('./levels/nivel3');
const nivel4 = require('./levels/nivel4');
const nivel5 = require('./levels/nivel5');
const nivel6 = require('./levels/nivel6');
const nivel7 = require('./levels/nivel7');

//const csrf1 = require('./levels/csrf1');


app.get('/', (req, res) => {
  res.redirect('/nivel1');
});

app.get('/nivel1', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(1, nivel1.render(payload)));
});

app.post('/nivel1', (req, res) => {
  const payload = req.body.payload || '';
  res.send(renderPage(1, nivel1.render(payload)));
});

app.get('/nivel2', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(2, nivel2.render(payload)));
});

app.post('/nivel2', (req, res) => {
  const payload = req.body.payload || '';
  //console.log('Payload recibido:', payload);  // <-- Agregar esto
  res.send(renderPage(2, nivel2.render(payload)));
});

app.get('/nivel3', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(3, nivel3.render(payload)));
});

app.post('/nivel3', (req, res) => {
  const payload = req.body.payload || '';
  //console.log('Payload recibido:', payload);  // <-- Agregar esto
  res.send(renderPage(3, nivel3.render(payload)));
});

app.get('/nivel4', (req, res) => {
    const payload = req.query.payload || '';
    res.send(renderPage(4, nivel4.render(payload)));
  });

app.post('/nivel4', (req, res) => {
  //console.log('POST recibido en nivel4');
  //console.log('req.body:', req.body);
  const payload = req.body.payload || '';
  //console.log('Payload extraído:', payload);
  res.send(renderPage(4, nivel4.render(payload)));
});


app.get('/nivel5', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(5, nivel5.render(payload)));
});

app.post('/nivel5', (req, res) => {
  const payload = req.body.payload || '';
  res.send(renderPage(5, nivel5.render(payload)));
});


app.get('/nivel6', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(6, nivel6.render(payload)));
});


app.post('/nivel6', (req, res) => {
  const payload = req.body.payload || '';
  res.send(renderPage(6, nivel6.render(payload)));
});

app.get('/nivel7', (req, res) => {
  const payload = req.query.payload || '';
  res.send(renderPage(7, nivel7.render(payload)));
});


app.post('/nivel7', (req, res) => {
  const payload = req.body.payload || '';
  res.send(renderPage(7, nivel7.render(payload)));
});




app.post('/check', async (req, res) => {
  const {payload, code} = req.body;
  if(!LEVELS[code]) return res.json({success: false});
  const {level, flag} = LEVELS[code];

  let b, d = false;
  try {
    b = await puppeteer.launch({headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const p = await b.newPage();
    p.on('dialog', async x => {d = true; await x.accept();});
    
    // Navegar a la página y hacer POST con el payload
    await p.goto(`http://localhost:3000/nivel${level}`, {waitUntil: 'networkidle0', timeout: 10000});
    
    // Inyectar el payload mediante evaluación en el navegador
    await p.evaluate((payloadData) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = window.location.href;
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'payload';
      input.value = payloadData;
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    }, payload);
    
    await p.waitForTimeout(2000);
    await b.close();
    res.json({success: d, flag: d ? flag : null});
  } catch(e) {
    if(b) await b.close();
    res.json({success: false});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));