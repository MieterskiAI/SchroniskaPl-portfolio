# 🐾 Schroniska PL — API schronisk dla zwierząt w Polsce
Otwarto-źródłowy projekt do importowania, normalizowania, geokodowania oraz udostępniania danych o schroniskach dla zwierząt w Polsce poprzez czyste REST API oparte na Node.js.

Backend obejmuje:
- hierarchiczne modelowanie danych (województwo → powiat → gmina → schronisko)
- automatyczny importer CSV z normalizacją, deduplikacją i nadawaniem UUID
- geokodowanie OpenStreetMap (Nominatim)
- REST API z wyszukiwaniem i funkcją znajdowania najbliższego schroniska

---

## 🚀 Funkcje

### 🔹 Endpointy REST API
| Endpoint | Opis |
|---------|------|
| **GET /api/tree** | Pełne drzewo hierarchiczne (regiony → schroniska) |
| **GET /api/shelters** | Lista wszystkich schronisk |
| **GET /api/shelters/:id** | Pobranie schroniska po UUID |
| **GET /api/search?city=&postal=** | Filtrowanie po mieście lub kodzie pocztowym |
| **GET /api/nearest?lat=&lng=** | Wyszukiwanie najbliższego schroniska |

---

## 🔹 Importer CSV (`backend/importCsv.js`)

Importer automatycznie:
- normalizuje nazwy regionów  
- usuwa duplikaty  
- nadaje UUID  
- waliduje i formatuje numery telefonów  
- mapuje pola CSV do struktury JSON  
- dodaje metadane `_importedAt` oraz `_source`

**Przykład użycia:**

    node backend/importCsv.js "/absolute/path/to/file.csv"

**Wynik:**
- schroniska zaimportowane  
- regiony utworzone automatycznie  
- duplikaty usunięte  
- zapis w `data/shelters.json`

---

## 🔹 Geokodowanie (`backend/geocode.js`)

Wykorzystuje OpenStreetMap Nominatim wraz z fallbackami:
1. Ulica + miasto  
2. Miasto  
3. Region  

**Użycie:**

    node backend/geocode.js

**Przykład wyniku:**

    "location": { "lat": 50.0619, "lng": 19.9368 }

---

## 🧱 Stos technologiczny
- Node.js  
- JSON (dataset)  
- OpenStreetMap Nominatim  
- Git + GitHub  
- Whimsical (diagramy danych)

---

## 🗂 Model danych

Województwo
└── Powiat
└── Gmina
└── Schronisko

Diagram Whimsical:  
https://whimsical.com/schroniska-pl-data-model-3mqBXmW3VFmNsFm69EkKYb@5QtYEQ3Nz4jB5ZcJh

---

## ▶️ Uruchomienie backendu

### Instalacja zależności

    npm install

### Uruchomienie API

    node backend/server.js

API dostępne pod adresem:  
http://localhost:3000

---

## 🔄 Import danych CSV

    node backend/importCsv.js "/path/to/file.csv"

Importer zwraca:
- liczbę dodanych schronisk  
- znormalizowane regiony  
- usunięte duplikaty  
- zaktualizowany `data/shelters.json`

---

## 🌍 Geokodowanie schronisk

    node backend/geocode.js

Dodaje do każdego rekordu:

    "location": { "lat": ..., "lng": ... }

---

## 📅 Roadmap
- zgłaszanie znalezionych zwierząt + upload zdjęć  
- usuwanie EXIF + miniatury  
- panel weryfikacji administratora  
- interfejs mapowy  
- automatyczne crawlery danych publicznych  
- ekspansja międzynarodowa  

---

## 📄 Licencja
MIT License © 2025 — MieterskiAI

---

## Uwagi dla utrzymujących projekt
- Importer CSV powinien archiwizować surowe pliki z `_importedAt` i `_source`.  
- Geokoder musi stosować limit zapytań Nominatim + cache lokalny.  
- Zdjęcia muszą mieć usunięte EXIF + wygenerowane miniatury.  
- Dane zgłaszających przechowywane zgodnie z RODO — tylko do kontaktu.  
- Eksport Whimsical powinien generować kompatybilne JSON/CSV (nodes + edges).


# 🐾 Schroniska PL — Animal Shelters API for Poland
Open-source project for importing, normalizing, geocoding and exposing animal shelter data in Poland through a clean Node.js REST API.

The backend includes:
- hierarchical data modeling (voivodeship → county → municipality → shelter)
- automatic CSV importer with normalization, deduplication and UUID assignment
- OpenStreetMap geocoding
- REST API with search and nearest-shelter lookup

---

## 🚀 Features

### 🔹 REST API Endpoints
| Endpoint | Description |
|---------|-------------|
| **GET /api/tree** | Full hierarchical tree (regions → shelters) |
| **GET /api/shelters** | Flat list of all shelters |
| **GET /api/shelters/:id** | Shelter by UUID |
| **GET /api/search?city=&postal=** | Filter by city or postal code |
| **GET /api/nearest?lat=&lng=** | Find nearest shelter |

---

## 🔹 CSV Importer (backend/importCsv.js)

The importer automatically:
- normalizes region names  
- removes duplicates  
- assigns UUIDs  
- validates and formats phone numbers  
- maps CSV fields into JSON structure  
- adds metadata `_importedAt` and `_source`

**Example usage:**

    node backend/importCsv.js "/absolute/path/to/file.csv"

**Result:**
- shelters imported  
- regions auto-created  
- duplicates removed  
- written to `data/shelters.json`

---

## 🔹 Geocoding (backend/geocode.js)

Uses OpenStreetMap Nominatim with multi-step fallback:
1. Street + city  
2. City only  
3. Region-level fallback  

**Usage:**

    node backend/geocode.js

**Example output:**

    "location": { "lat": 50.0619, "lng": 19.9368 }

---

## 🧱 Tech Stack
- Node.js  
- JSON structured dataset  
- OpenStreetMap Nominatim  
- Git + GitHub  
- Whimsical (data modeling)

---

## 🗂 Data Model (Hierarchy)

Voivodeship
└── County
└── Municipality
└── Shelter

Diagram (Whimsical):  
https://whimsical.com/schroniska-pl-data-model-3mqBXmW3VFmNsFm69EkKYb@5QtYEQ3Nz4jB5ZcJh

---

## ▶️ Running the Backend

### Install dependencies

    npm install

### Start API

    node backend/server.js

Backend available at:  
http://localhost:3000

---

## 🔄 Importing CSV Data

    node backend/importCsv.js "/path/to/file.csv"

Importer outputs:
- number of imported shelters  
- normalized region names  
- deduped dataset  
- written to `data/shelters.json`

---

## 🌍 Geocoding Shelters

    node backend/geocode.js

Each shelter receives:

    "location": { "lat": ..., "lng": ... }

---

## 📅 Roadmap
- Lost pet reporting + image upload  
- EXIF stripping + thumbnail generation  
- Admin verification dashboard  
- Web map interface  
- Automatic crawlers for public data  
- Multi-country expansion  

---

## 📄 License
MIT License © 2025 — MieterskiAI

---

## Maintainer Notes
- The CSV importer should store raw snapshots with `_importedAt` and `_source`.  
- Geocoder must respect Nominatim rate limits and use caching.  
- Images must have EXIF removed and thumbnails generated.  
- Reporter personal data must remain private (GDPR compliant).  
- Whimsical export should generate compatible JSON/CSV node-edge structures.
