const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputPath = process.argv[2] || path.join(__dirname, '..', 'data', 'schroniska_demo.csv');
const sheltersJsonPath = path.join(__dirname, '..', 'data', 'shelters.json');

function normalizeKey(k) {
  if (!k) return '';
  k = k.toString().trim().toLowerCase();
  const map = {
    name: ['name','nazwa','shelter','nazwa_schroniska'],
    address: ['address','adres','ulica','street'],
    postalCode: ['postalcode','kod','kod_pocztowy','postcode','zip'],
    city: ['city','miasto','town'],
    voivodeship: ['voivodeship','wojewodztwo','województwo','province','region'],
    county: ['county','powiat','district'],
    municipality: ['municipality','gmina','commune'],
    phone: ['phone','telefon','tel'],
    email: ['email','e-mail','mail'],
    website: ['website','site','www','strona'],
    lat: ['lat','latitude'],
    lon: ['lon','lng','long','longitude'],
    id: ['id','identifier']
  };
  for (const key in map) {
    if (map[key].includes(k)) return key;
  }
  return k.replace(/\s+/g, '_');
}

function detectHeaderMap(headers) {
  const map = {};
  headers.forEach(h => map[h] = normalizeKey(h));
  return map;
}

function toFloat(v) {
  const n = parseFloat((v||'').toString().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

function loadSheltersJson() {
  if (!fs.existsSync(sheltersJsonPath)) return { voivodeships: [] };
  return JSON.parse(fs.readFileSync(sheltersJsonPath, 'utf8'));
}

function saveSheltersJson(data) {
  fs.writeFileSync(sheltersJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved', sheltersJsonPath);
}

function ensureVoivodeship(data, name) {
  name = (name||'').trim() || 'Unknown';
  let v = data.voivodeships.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!v) { v = { name, code: '', counties: [] }; data.voivodeships.push(v); }
  return v;
}
function ensureCounty(voiv, name) {
  name = (name||'').trim() || 'Unknown';
  let c = voiv.counties.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!c) { c = { name, municipalities: [] }; voiv.counties.push(c); }
  return c;
}
function ensureMunicipality(county, name) {
  name = (name||'').trim() || 'Unknown';
  let m = county.municipalities.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!m) { m = { name, shelters: [] }; county.municipalities.push(m); }
  return m;
}

(async () => {
  if (!fs.existsSync(inputPath)) {
    console.error("CSV not found at", inputPath);
    process.exit(2);
  }

  const rows = [];
  let headerMap = null;

  await new Promise((resolve, reject) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('headers', headers => {
        headerMap = detectHeaderMap(headers);
        console.log("Detected headers:", headerMap);
      })
      .on('data', row => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  const data = loadSheltersJson();
  let count = 0;

  for (const raw of rows) {
    const rec = {};

    for (const key of Object.keys(raw)) {
      rec[headerMap[key]] = raw[key].trim();
    }

    const voiv = ensureVoivodeship(data, rec.voivodeship);
    const cnt = ensureCounty(voiv, rec.county);
    const mun = ensureMunicipality(cnt, rec.municipality);

    mun.shelters.push({
      id: rec.id || `import-${Date.now()}-${count}`,
      name: rec.name,
      address: rec.address,
      postalCode: rec.postalCode,
      city: rec.city,
      voivodeship: rec.voivodeship,
      county: rec.county,
      municipality: rec.municipality,
      phone: rec.phone,
      email: rec.email,
      website: rec.website,
      location: rec.lat && rec.lon ? { lat: Number(rec.lat), lon: Number(rec.lon) } : null,
      _importedAt: new Date().toISOString(),
      _source: inputPath
    });

    count++;
  }

  saveSheltersJson(data);
  console.log("Import complete. Added:", count);
})();
