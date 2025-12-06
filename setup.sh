#!/usr/bin/env bash
set -e

echo "Tworzę strukturę katalogów..."
mkdir -p backend/data frontend static tools .github/workflows

echo "Tworzę LICENSE..."
cat > LICENSE <<'LICENSE'
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
[...] (skrócone dla czytelności)
LICENSE

echo "Tworzę .gitignore..."
cat > .gitignore <<'GITIGNORE'
node_modules/
.env
.DS_Store
venv/
__pycache__/
GITIGNORE

echo "Tworzę backend/package.json..."
cat > backend/package.json <<'JSON'
{
  "name": "schroniska-backend",
  "version": "0.1.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "csv-parser": "^3.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node index.js"
  }
}
JSON

echo "Tworzę backend/index.js..."
cat > backend/index.js <<'JS'
const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3001, () => console.log("Backend działa na porcie 3001"));
JS

echo "Tworzę demo CSV..."
cat > backend/data/schroniska_demo.csv <<'CSV'
id,name,address,postal,city
1,Schronisko Demo A,Psia 1,00-001,Warszawa
2,Schronisko Demo B,Kocia 2,02-222,Warszawa
3,Schronisko Demo C,Lesna 5,30-300,Krakow
CSV

echo "Tworzę frontend/index.html..."
cat > frontend/index.html <<'HTML'
<!DOCTYPE html>
<html>
<body>
<h1>Schroniska PL</h1>
<input id="postal" placeholder="00-001">
<button onclick="search()">Szukaj</button>
<pre id="out"></pre>
<script>
async function search() {
  const postal = document.getElementById("postal").value;
  const r = await fetch("/api/shelters?postal=" + postal);
  const data = await r.json();
  document.getElementById("out").textContent = JSON.stringify(data, null, 2);
}
</script>
</body>
</html>
HTML

echo "GOTOWE!"
