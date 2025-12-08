// backend/server.js
// Proste REST API do serwowania danych schronisk z pliku JSON

const http = require("http");
const fs = require("fs");
const path = require("path");

// Ścieżka do pliku z danymi
const dataPath = path.join(__dirname, "..", "data", "shelters.json");

// Helper: wczytanie danych z pliku
function loadShelters() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const json = JSON.parse(raw);

  // Spłaszczamy strukturę do listy schronisk z pełną ścieżką geograficzną
  const shelters = [];

  for (const v of json.voivodeships) {
    for (const c of v.counties) {
      for (const m of c.municipalities) {
        for (const s of m.shelters) {
          shelters.push({
            ...s,
            voivodeship: v.name,
            county: c.name,
            municipality: m.name
          });
        }
      }
    }
  }

  return shelters;
}

// REST API
const server = http.createServer((req, res) => {
  // Prosty CORS (żeby frontend mógł się łączyć)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/shelters -> lista wszystkich schronisk
  if (req.method === "GET" && url.pathname === "/api/shelters") {
    const shelters = loadShelters();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(shelters));
    return;
  }

  // GET /api/shelters/:id -> jedno schronisko po ID
  if (req.method === "GET" && url.pathname.startsWith("/api/shelters/")) {
    const id = url.pathname.split("/").pop();
    const shelters = loadShelters();
    const shelter = shelters.find((s) => s.id === id);

    if (!shelter) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Shelter not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(shelter));
    return;
  }

  // Fallback: 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// Domyślny port
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Schroniska PL API is running on http://localhost:${PORT}`);
});
