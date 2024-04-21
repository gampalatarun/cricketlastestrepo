const express = require('express')
const app = express()

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
app.use(express.json())

const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null

//instializeDBandserver

const instializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Dbserver ${e.message}`)
    process.exit(1)
  }
}

instializeDBandServer()

const convetsnakecaseToCamelCase = db => {
  return {
    playerId: db.player_id,
    playerName: db.player_name,
    jerseyNumber: db.jersey_number,
    role: db.role,
  }
}

//API 1
app.get('/players/', async (request, response) => {
  const playersQuery = `
    SELECT
    *
    FROM 
    
    cricket_team;
    `
  const allplayer = await db.all(playersQuery)
  response.send(
    allplayer.map(eachplayer => convetsnakecaseToCamelCase(eachplayer)),
  )
})

//API 3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const basesonPLayeridQuery = `
  SELECT * FROM cricket_team WHERE player_id=${playerId};
  `
  const playeridarray = await db.all(basesonPLayeridQuery)

  const array1 = playeridarray.map(each => convetsnakecaseToCamelCase(each))
  response.send(array1[0])
})

//API 5

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE FROM cricket_team WHERE player_id=${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})
module.exports = app

//API 2

app.post('/players/', async (request, response) => {
  const cricketerDetails = request.body

  const {player_name, jersey_number, role} = cricketerDetails

  const insertQuey = `
  INSERT INTO
  cricket_team(player_name,jersey_number,role)

  VALUES(
    '${player_name}',
    ${jersey_number},
    '${role}'

  )
  `
  const playerAdd = await db.run(insertQuey)
  response.send('Player Added to Team')
})

// API 4  updating the details of the crickter

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const crickterDetails = request.body
  const {player_name, jersey_number, role} = crickterDetails

  const UpdateQuery = `
  UPDATE
  cricket_team

  SET

    player_name= '${player_name}',
    jersey_number= ${jersey_number},
    role='${role}'

  WHERE 
  
    player_id=${playerId}
 `
  const updatedetails = await db.run(UpdateQuery)
  response.send('Player Details Updated')
})
