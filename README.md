# 🦠 COVID-19 India Backend

A Node.js + Express.js REST API using SQLite to manage COVID-19 data for Indian states and districts.

---

## ⚙️ Tech
- Node.js  
- Express.js  
- SQLite (`sqlite3`, `sqlite`)

---

## 📁 Database
**Tables**
- `state(state_id, state_name, population)`
- `district(district_id, district_name, state_id, cases, cured, active, deaths)`

---

## 🚀 APIs

| # | Method | Endpoint | Description |
|---|---------|-----------|--------------|
| 1 | GET | `/states/` | Get all states |
| 2 | GET | `/states/:stateId/` | Get a state by ID |
| 3 | POST | `/districts/` | Add a district |
| 4 | GET | `/districts/:districtId/` | Get a district by ID |
| 5 | DELETE | `/districts/:districtId/` | Delete a district |
| 6 | PUT | `/districts/:districtId/` | Update a district |
| 7 | GET | `/states/:stateId/stats/` | Get total stats for a state |
| 8 | GET | `/districts/:districtId/details/` | Get state name of a district |

---

## 🧠 Highlights
- Full CRUD with Express routes  
- Async SQLite queries  
- Safe SQL using placeholders (`?`)  
- JSON request handling  
- Clean API responses (camelCase keys)

---

## ▶️ Run Locally
```bash
npm install
node app.js
