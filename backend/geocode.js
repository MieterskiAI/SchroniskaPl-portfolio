// backend/geocode.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const sheltersFile = path.join(__dirname, '..', 'data', 'shelters.json');
const outputFile = sheltersFile;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SchroniskaPL/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function geocodeAddress(address, city, postal) {
  const attempts = [
    `${address}, ${postal}, ${city}, Polska`,
    `${address}, ${city}, Polska`,
    `${city}, Polska`
  ];

  for (const q of attempts) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const response = await fetchJson(url);

    if (response.length > 0) {
      return {
        lat: parseFloat(response[0].lat),
        lng: parseFloat(response[0].lon)
      };
    }

    await new Promise(r => setTimeout(r, 1200));
  }

  return null;
}

async function geocodeShelters() {
  const json = JSON.parse(fs.readFileSync(sheltersFile, 'utf8'));
  let count = 0;

  for (const v of json.voivodeships) {
    for (const c of v.counties) {
      for (const m of c.municipalities) {
        for (const sh of m.shelters) {
          console.log(`Geocoding: ${sh.name} → ${sh.address}, ${sh.city}`);

          const loc = await geocodeAddress(sh.address, sh.city, sh.postalCode);

          if (loc) {
            sh.location = loc;
            console.log(`  ✓ Found: ${loc.lat}, ${loc.lng}`);
            count++;
          } else {
            console.log(`  ✗ No results`);
          }

          await new Promise(r => setTimeout(r, 1200));
        }
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
  console.log(`\nGeocoding complete → updated ${count} shelters.`);
}

geocodeShelters();

