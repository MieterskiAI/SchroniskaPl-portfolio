// backend/importCsv.js
// Robust CSV importer: normalization, dedupe, UUID ids, safe _source

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

if (!process.argv[2]) {
  console.error('Usage: node backend/importCsv.js "/pełna/ścieżka/do/pliku.csv"');
  process.exit(1);
}

const inputPath = process.argv[2];
const results = [];
const report = { added: 0, duplicates: 0, errors: 0, rows: 0 };

// Mapowanie nazw województw do kanonicznych form
const canonicalVoivodeships = {
  "malopolskie": "Małopolskie",
  "małopolskie": "Małopolskie",
  "mazowieckie": "Mazowieckie",
  "wielkopolskie": "Wielkopolskie",
};

// Normalizacja kodu pocztowego
function normalizePostal(postal) {
  if (!postal) return '';
  const s = postal.trim();
  const digits = s.replace(/\s+/g, '');
  if (/^\d{2}-\d{3}$/.test(digits)) return digits;
  if (/^\d{5}$/.test(digits)) return digits.slice(0, 2) + "-" + digits.slice(2);
  return s;
}

// Normalizacja numeru telefonu
function normalizePhone(raw) {
  if (!raw) return '';
  const p = raw.replace(/[^\d\+]/g, '');
  try {
    const parsed = parsePhoneNumberFromString(p, 'PL');
    if (parsed && parsed.isValid()) return parsed.formatInternational();
  } catch (e) {}
  return raw.trim();
}

// Kanonizacja województwa
function canonicalVoivode(v) {
  if (!v) return '';
  const key = v.toLowerCase().replace(/\s+/g, '');
  return canonicalVoivodeships[key] || v;
}

// Trim string
function normalizeStr(s) {
  if (!s) return '';
  return s.trim();
}

// Bezpieczne _source — tylko nazwa pliku
function basenameSource(s) {
  if (!s) return '';
  try {
    return path.basename(s);
  } catch (e) {
    return s;
  }
}

// Wczytaj istniejący shelters.json
const dataFile = path.join(__dirname, "..", "data", "shelters.json");
let existingData = { voivodeships: [] };

try {
  if (fs.existsSync(dataFile)) {
    existingData = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }
} catch (e) {
  console.warn("Could not read existing shelters.json, will create new.");
}

// Spłaszcz istniejące dane do mapy (do deduplikacji)
const flatExisting = {};
(function indexExisting() {
  (existingData.voivodeships || []).forEach(v => {
    (v.counties || []).forEach(c => {
      (c.municipalities || []).forEach(m => {
        m.shelters = m.shelters || [];
        (m.shelters || []).forEach(s => {
          const key = (s.name || '').toLowerCase().replace(/\s+/g, '') + "|" + (s.postalCode || '');
          flatExisting[key] = s;
        });
      });
    });
  });
})();

// Czytanie CSV
fs.createReadStream(inputPath)
  .pipe(csv())
  .on("data", row => {
    report.rows++;

    try {
      // Mapowanie nazw kolumn (różne warianty)
      const name = row.name || row.nazwa || row.NAZWA || row["nazwa_schroniska"] || '';
      const address = row.address || row.adres || '';
      const postal = row.postalCode || row.kod_pocztowy || '';
      const city = row.city || row.miejscowosc || '';
      const voiv = row.voivodeship || row.wojewodztwo || '';
      const county = row.county || row.powiat || '';
      const municipality = row.municipality || row.gmina || '';
      const phone = row.phone || row.telefon || '';
      const email = row.email || row.mail || '';
      const website = row.website || row.strona || '';

      const normalizedPostal = normalizePostal(postal);
      const normalizedPhone = normalizePhone(phone);
      const normalizedVoiv = canonicalVoivode(voiv);

      const shelter = {
        id: row.id && row.id.trim() ? row.id.trim() : uuidv4(),
        name: normalizeStr(name),
        address: normalizeStr(address),
        postalCode: normalizedPostal,
        city: normalizeStr(city),
        voivodeship: normalizedVoiv,
        county: normalizeStr(county),
        municipality: normalizeStr(municipality),
        phone: normalizedPhone,
        email: normalizeStr(email),
        website: normalizeStr(website),
        location: null,
        _importedAt: new Date().toISOString(),
        _source: basenameSource(inputPath),
      };

      // Klucz do deduplikacji
      const key = (shelter.name || "").toLowerCase().replace(/\s+/g, "") + "|" + (shelter.postalCode || "");

      if (flatExisting[key]) {
        report.duplicates++;
      } else {
        flatExisting[key] = shelter;
        results.push(shelter);
        report.added++;
      }
    } catch (err) {
      console.error("Error parsing row", err);
      report.errors++;
    }
  })
  .on("end", () => {
    // Odtworzenie drzewa woj→powiat→gmina
    const tree = {};

    (existingData.voivodeships || []).forEach(v => {
      tree[v.name] = v;
      (v.counties || []).forEach(c => {
        (c.municipalities || []).forEach(m => {
          m.shelters = m.shelters || [];
        });
      });
    });

    // Dodaj nowe wpisy
    Object.values(flatExisting).forEach(shelter => {
      const vName = shelter.voivodeship || "Unknown";
      const cName = shelter.county || "Unknown";
      const mName = shelter.municipality || "Unknown";

      if (!tree[vName]) {
        tree[vName] = { name: vName, code: "", counties: [] };
      }

      const voiv = tree[vName];

      let county = voiv.counties.find(x => x.name === cName);
      if (!county) {
        county = { name: cName, municipalities: [] };
        voiv.counties.push(county);
      }

      let mun = county.municipalities.find(x => x.name === mName);
      if (!mun) {
        mun = { name: mName, shelters: [] };
        county.municipalities.push(mun);
      }

      if (!mun.shelters.find(x => x.id === shelter.id)) {
        mun.shelters.push(shelter);
      }
    });

    const output = { voivodeships: Object.values(tree) };
    output.voivodeships.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(dataFile, JSON.stringify(output, null, 2), "utf8");

    console.log("Import complete. Report:", report);
    console.log("Output written to", dataFile);
  });

