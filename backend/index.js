const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const DATA = path.join(__dirname, 'data', 'schroniska_demo.csv');
let shelters = [];

function loadCSV() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(DATA)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

loadCSV().then(r => {
  shelters = r;
  console.log("Wczytano rekordów:", r.length);
});

app.get('/health', (req, res) => res.json({ status: "ok" }));

app.get('/api/shelters', (req, res) => {
  const postal = (req.query.postal || '').trim();
  const filtered = shelters.filter(x => x.postal && x.postal.startsWith(postal));
  res.json(filtered);
});







console.log("DEBUG: reaching app.listen");
app.listen(3001, () => console.log("Backend działa na porcie 3001"));
