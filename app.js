const http = require('http');
const fs = require('fs');

const upload = require('./services/Drive');
const formidable = require('formidable');
const { getLastNo, inserToSheet } = require('./services/Sheets');

function renderAssets(req, res) {
  switch (req.url) {
    case '/assets/css/style.css':
      res.writeHead(200, { 'Content-Type': 'text/css' });
      const fileCSS = fs.readFileSync('./assets/css/style.css', { encoding: 'utf-8' });
      res.write(fileCSS);
      res.end();
      break;
    case '/assets/js/index.js':
      res.writeHead(200, { 'Content-Type': 'text/js' });
      const fileJS = fs.readFileSync('./assets/js/index.js', { encoding: 'utf-8' });
      res.write(fileJS);
      res.end();
      break;
    case '/assets/img/logo-himarpl.png':
      res.writeHead(200, { 'Content-Type': 'image/png' });
      const fileLogoHima = fs.readFileSync('./assets/img/logo-himarpl.png');
      res.write(fileLogoHima);
      res.end();
      break;
    case '/assets/img/logo-kabinet-explora.png':
      res.writeHead(200, { 'Content-Type': 'image/png' });
      const fileLogoKabinet = fs.readFileSync('./assets/img/logo-kabinet-explora.png');
      res.write(fileLogoKabinet);
      res.end();
      break;
    case '/assets/img/success.svg':
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      const illustrationSuccess = fs.readFileSync('./assets/img/success.svg');
      res.write(illustrationSuccess);
      res.end();
      break;
  }
}

function handleInsert(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      res.end(String(err));
      return;
    }

    const { nama, sekolah, telp, jalur, jenis_kelamin } = fields;

    if (!nama || !sekolah || !telp || !jalur || !jenis_kelamin) {
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
      return;
    }

    try {
      // Data for sheets
      const id = await getLastNo();
      const values = [[ String(Number(id)+1), ...Object.values(fields) ]];

      // Data for drive
      const { mimetype, filepath } = files.screenshot;
      const filename = `${Number(id) + 1}. ${fields.nama} - ${fields.telp}`;
  
      const insertedData = await inserToSheet(values);
      const uploadedImage = await upload(filename, mimetype, filepath);

      if (insertedData.statusText.toLowerCase() === 'ok' && uploadedImage.statusText.toLowerCase() === 'ok') {
        res.writeHead(302, {
          'Location': '/success'
        });
        res.end();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function renderHtml(path, res) {
  fs.readFile(path, null, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('File tidak ditemukan')
    } else {
      res.write(data);
    }
    res.end();
  });
}

const server = http.createServer(async (req, res) => {
  renderAssets(req, res);
  if (req.url === '/') {
    switch (req.method.toLowerCase()) {
      case 'get':
        res.writeHead(200, { 'Content-Type': 'text/html' });
        renderHtml('./index.html', res);
        break;
      case 'post':
        handleInsert(req, res);
        break;
    }
  } else if (req.url === '/success' && req.method.toLowerCase() === 'get') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    renderHtml('./success.html', res);
  }
});

server.listen(process.env.PORT || 3000);
