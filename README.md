## 🛠️ Tech Stack  
**Frontend:** HTML / CSS / JavaScript  
**Backend:** Node.js (native HTTP module, simple REST API)  
**Data:** JSON (hierarchical structure: voivodeship → county → municipality → shelter)  
**AI Logic:** ChatGPT (custom GPT & prompt engineering)  
**Other:** Git, GitHub, MIT License  
## 🌐 REST API Endpoints

The backend exposes a very simple REST API:

- `GET /api/shelters` – returns a flat list of all shelters with region metadata  
- `GET /api/shelters/:id` – returns a single shelter by its `id` (e.g. `krk-1`)  

This API is powered by a minimal Node.js HTTP server reading from `data/shelters.json`.
## ▶️ Run the Backend

To start the API locally:

```bash
node backend/server.js
http://localhost:3001
