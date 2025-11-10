const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'covid19India.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// API 1: Get all states
app.get('/states/', async (request, response) => {
  const getStatesQuery = `
    SELECT * FROM state;
  `
  const states = await db.all(getStatesQuery)
  response.send(
    states.map(eachState => ({
      stateId: eachState.state_id,
      stateName: eachState.state_name,
      population: eachState.population,
    })),
  )
})

// API 2: Get state by ID
app.get('/states/:stateId/', async (request, response) => {
  const {stateId} = request.params
  const getStateQuery = `
    SELECT * FROM state WHERE state_id = ?;
  `
  const state = await db.get(getStateQuery, [stateId])
  response.send({
    stateId: state.state_id,
    stateName: state.state_name,
    population: state.population,
  })
})

// API 3: Add new district
app.post('/districts/', async (request, response) => {
  const {districtName, stateId, cases, cured, active, deaths} = request.body
  const addDistrictQuery = `
    INSERT INTO district
      (district_name, state_id, cases, cured, active, deaths)
    VALUES (?, ?, ?, ?, ?, ?);
  `
  await db.run(addDistrictQuery, [
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  ])
  response.send('District Successfully Added')
})

// API 4: Get district by ID
app.get('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const getDistrictQuery = `
    SELECT * FROM district WHERE district_id = ?;
  `
  const district = await db.get(getDistrictQuery, [districtId])
  response.send({
    districtId: district.district_id,
    districtName: district.district_name,
    stateId: district.state_id,
    cases: district.cases,
    cured: district.cured,
    active: district.active,
    deaths: district.deaths,
  })
})

// API 5: Delete district
app.delete('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const deleteQuery = `
    DELETE FROM district WHERE district_id = ?;
  `
  await db.run(deleteQuery, [districtId])
  response.send('District Removed')
})

// API 6: Update district details
app.put('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const {districtName, stateId, cases, cured, active, deaths} = request.body
  const updateQuery = `
    UPDATE district
    SET
      district_name = ?,
      state_id = ?,
      cases = ?,
      cured = ?,
      active = ?,
      deaths = ?
    WHERE district_id = ?;
  `
  await db.run(updateQuery, [
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
    districtId,
  ])
  response.send('District Details Updated')
})

// API 7: Get total stats of a state
app.get('/states/:stateId/stats/', async (request, response) => {
  const {stateId} = request.params
  const statsQuery = `
    SELECT
      SUM(cases) AS totalCases,
      SUM(cured) AS totalCured,
      SUM(active) AS totalActive,
      SUM(deaths) AS totalDeaths
    FROM district
    WHERE state_id = ?;
  `
  const stats = await db.get(statsQuery, [stateId])
  response.send(stats)
})

// API 8: Get state name of a district
app.get('/districts/:districtId/details/', async (request, response) => {
  const {districtId} = request.params
  const query = `
    SELECT state.state_name AS stateName
    FROM district
    INNER JOIN state
      ON district.state_id = state.state_id
    WHERE district.district_id = ?;
  `
  const result = await db.get(query, [districtId])
  response.send(result)
})

module.exports = app
