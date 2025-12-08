# 🐾 Schroniska PL — Open-Source Project
Open-source application for locating animal shelters in Poland, built with a simple Node.js REST API and a hierarchical JSON data structure.

## 🛠️ Tech Stack
Frontend: HTML / CSS / JavaScript  
Backend: Node.js (native HTTP module, simple REST API)  
Data: JSON (hierarchical structure: voivodeship → county → municipality → shelter)  
AI Logic: ChatGPT (custom GPT & prompt engineering)  
Other: Git, GitHub, MIT License

## 🌐 REST API Endpoints
GET /api/shelters  
Returns a flat list of all shelters with region metadata.

GET /api/shelters/:id  
Returns a single shelter by its id (e.g., krk-1).

The API reads and flattens hierarchical data from data/shelters.json.

## 🗺 Data Model & Diagram
Shelter data is stored using a hierarchical structure:
Voivodeship → County → Municipality → Shelter.

Example (from data/shelters.json):
Malopolskie → Krakow → Krakow → Schronisko dla Bezdomnych Zwierzat w Krakowie (id: krk-1).

Full data model diagram:  
https://whimsical.com/schroniska-pl-data-model-3mqBXmW3VFmNsFm69EkKYb@5QtYEQ3Nz4jB5ZcJh
- Voivodeship → County → Municipality → Shelter

Example (from `data/shelters.json`):

- Małopolskie → Kraków → Kraków → Schronisko dla Bezdomnych Zwierząt w Krakowie (`id: krk-1`)

You can view the full data model diagram here:

[View Whimsical diagram](https://whimsical.com/schroniska-pl-data-model-3mqBXmW3VFmNsFm69EkKYb@5QtYEQ3Nz4jB5ZcJh)
## ▶️ Run the Backend
To start the API locally:
node backend/server.js

Backend available at:  
http://localhost:3001

## 📸 Screenshots
API — list of shelters  
API — single shelter

## 📄 License
This project is released under the MIT License.

## 🙌 About the Project
Schroniska PL is an open-source initiative designed to organize and expose animal shelter data in Poland via a simple REST API.

Planned extensions include:
- AI-assisted lost-pet reporting
- Automated data validation
- Geographic grouping and filtering
- Integration with external shelter APIs

Project created and maintained by MieterskiAI.
## Import CSV (automatyczny)

Projekt zawiera skrypt `backend/importCsv.js`, który automatycznie importuje pliki CSV do hierarchicznego formatu `data/shelters.json` (województwo → powiat → gmina → schroniska).

### Jak użyć:
1. Uruchom komendę:
```bash
node backend/importCsv.js "/pełna/ścieżka/do/pliku.csv"
2. Skrypt automatycznie:
- rozpoznaje nagłówki CSV (np. nazwa, adres, kod_pocztowy, województwo, powiat, gmina),
- mapuje je do pól JSON,
- dopisuje dane do odpowiednich regionów,
- dodaje pola `_source` i `_importedAt` (śledzenie źródła).

### Dlaczego to jest ważne:
- nie trzeba ręcznie edytować JSON,
- łatwo można dodawać dane z różnych źródeł,
- system nadaje się do skalowania na kolejne województwa,
- rekruter widzi realną automatyzację danych.
**Przykład użycia:**

```bash
node backend/importCsv.js "/Users/maciejklimek/Schroniska-PL/data/schroniska_demo.csv"

Po uruchomieniu:
- dane zostaną wczytane,
- automatycznie dopasowane do regionów,
- zapisane do `data/shelters.json`,
- pojawi się informacja `Import complete. Added: X`

