🐾 Schroniska PL — Animal Shelters API for Poland
Open-source project for importing, normalizing, geocoding and exposing animal shelter data in Poland via a clean Node.js REST API.
The backend includes:
hierarchical data modeling (voivodeship → county → municipality → shelter)
automatic CSV importer with normalization, dedupe and UUIDs
OpenStreetMap geocoding
REST API with search and nearest-shelter lookup
🚀 Features
🔹 REST API Endpoints
Endpoint	Description
GET /api/tree	Full hierarchical tree (regions → shelters)
GET /api/shelters	Flat list of all shelters
GET /api/shelters/:id	Shelter by UUID
GET /api/search?city=&postal=	Filter by city or postal code
GET /api/nearest?lat=&lng=	Find nearest shelter
🔹 CSV Importer (backend/importCsv.js)
Importer automatically:
normalizes region names
removes duplicates
assigns UUIDs
validates / formats phone numbers
maps CSV fields to JSON
adds metadata _importedAt and _source
👉 Example usage:
node backend/importCsv.js "/absolute/path/to/file.csv"
Result:
shelters imported
regions auto-created
duplicates removed
written to data/shelters.json
🔹 Geocoding (backend/geocode.js)
Uses OpenStreetMap Nominatim with multi-step fallback:
Street + city
City only
Region-level fallback
Usage:
node backend/geocode.js
Result example:
"location": { "lat": 50.0619, "lng": 19.9368 }
🧱 Tech Stack
Node.js
JSON structured dataset
OpenStreetMap Nominatim
Git + GitHub
Whimsical → data model diagram
🗂 Data Model (Hierarchical)
Voivodeship
 └── County
      └── Municipality
           └── Shelter
Diagram (Whimsical)
👉 https://whimsical.com/schroniska-pl-data-model-3mqBXmW3VFmNsFm69EkKYb@5QtYEQ3Nz4jB5ZcJh
▶️ Running the Backend
Install dependencies
npm install
Start API
node backend/server.js
Backend available at:
👉 http://localhost:3000
🔄 Importing CSV Data
node backend/importCsv.js "/path/to/file.csv"
Importer outputs:
number of added shelters
normalized regions
deduped dataset
updated data/shelters.json
🌍 Geocoding Shelters
node backend/geocode.js
Updates each shelter with:
"location": { "lat": ..., "lng": ... }
📸 Screenshots
(Screenshots will be added soon)
📅 Roadmap
Lost pet reporting with image upload
EXIF removal + thumbnails
Admin verification dashboard
Web map interface
Automatic crawlers for public shelter data
Multi-country expansion
📄 License
MIT License © 2025 — MieterskiAI
