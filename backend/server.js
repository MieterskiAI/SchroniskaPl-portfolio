// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Wczytujemy shelters.json (drzewo województwo → powiat → gmina → schroniska)
const dataFile = path.join(__dirname, '..', 'data', 'shelters.json');
let tree = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const dataFileStats = fs.statSync(dataFile);

// Flatten — zamienia całe drzewo na jedną tablicę schronisk
function flattenShelters(tree) {
  const result = [];

  for (const v of tree.voivodeships) {
    for (const c of v.counties) {
      for (const m of c.municipalities) {
        for (const sh of m.shelters) {
          result.push({
            ...sh,
            voivodeship: v.name,
            county: c.name,
            municipality: m.name
          });
        }
      }
    }
  }

  return result;
}

const shelters = flattenShelters(tree);

function buildRegions(tree) {
  return tree.voivodeships.map((voivodeship) => ({
    name: voivodeship.name,
    counties: voivodeship.counties.map((county) => county.name)
  }));
}

const regions = buildRegions(tree);
const voivodeshipSet = new Set(regions.map((region) => region.name));
const countyIndex = regions.reduce((acc, region) => {
  acc[region.name] = new Set(region.counties);
  return acc;
}, {});

function getMetadata() {
  return {
    updatedAt: dataFileStats.mtime.toISOString(),
    totalShelters: shelters.length
  };
}

// CORS + JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ROOT
app.get('/', (req, res) => {
  res.send('SchroniskaPL API działa! 🚀');
});

// 1. Zwraca CAŁE drzewo
app.get('/api/tree', (req, res) => {
  res.json(tree);
});

// 2. Lista WSZYSTKICH schronisk (flatten)
app.get('/api/shelters', (req, res) => {
  const { voivodeship, county, ...rest } = req.query;

  if (Object.keys(rest).length > 0) {
    return res.status(400).json({
      error: 'Nieobsługiwane parametry zapytania',
      details: Object.keys(rest)
    });
  }

  if (county && !voivodeship) {
    return res.status(400).json({
      error: 'Parametr county wymaga podania voivodeship'
    });
  }

  if (voivodeship && !voivodeshipSet.has(voivodeship)) {
    return res.status(400).json({
      error: 'Nieznane województwo',
      value: voivodeship
    });
  }

  if (county && !countyIndex[voivodeship]?.has(county)) {
    return res.status(400).json({
      error: 'Nieznany powiat dla wskazanego województwa',
      value: county
    });
  }

  let results = shelters;
  if (voivodeship) {
    results = results.filter((s) => s.voivodeship === voivodeship);
  }
  if (county) {
    results = results.filter((s) => s.county === county);
  }

  res.json(results);
});

// 3. Pojedyncze schronisko po ID
app.get('/api/shelters/:id', (req, res) => {
  const sh = shelters.find(s => s.id === req.params.id);
  if (!sh) return res.status(404).json({ error: "Nie znaleziono schroniska" });
  res.json(sh);
});

// 4. Wyszukiwanie po mieście / kodzie pocztowym
app.get('/api/search', (req, res) => {
  const { city, postal } = req.query;

  let results = shelters;

  if (city) {
    results = results.filter(s => s.city.toLowerCase().includes(city.toLowerCase()));
  }

  if (postal) {
    results = results.filter(s => s.postalCode.startsWith(postal));
  }

  res.json(results);
});

// 5. Najbliższe schronisko od współrzędnych ?lat=...&lng=...
app.get('/api/nearest', (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Podaj lat i lng" });

  function dist(a, b) {
    return Math.sqrt((a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2);
  }

  const withLocation = shelters.filter(s => s.location && s.location.lat);
  const nearest = withLocation.reduce((best, sh) => {
    const d = dist({ lat: +lat, lng: +lng }, sh.location);
    return !best || d < best.dist ? { sh, dist: d } : best;
  }, null);

  res.json(nearest ? nearest.sh : { error: "Brak schronisk z lokalizacją" });
});

// 6. Regiony do filtrów (województwa + powiaty)
app.get('/api/regions', (req, res) => {
  res.json({
    updatedAt: getMetadata().updatedAt,
    voivodeships: regions
  });
});

// 7. Metadane (timestamp, liczba schronisk)
app.get('/api/meta', (req, res) => {
  res.json(getMetadata());
});

app.listen(PORT, () =>
  console.log(`🔥 SchroniskaPL API działa na http://localhost:${PORT}`)
);
