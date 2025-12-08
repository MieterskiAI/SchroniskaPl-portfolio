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
